package com.docscan.PdfCreator;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;

import androidx.exifinterface.media.ExifInterface;

import com.facebook.react.bridge.ReadableMap;
import com.tom_roush.pdfbox.pdmodel.PDDocument;
import com.tom_roush.pdfbox.pdmodel.PDPage;
import com.tom_roush.pdfbox.pdmodel.PDPageContentStream;
import com.tom_roush.pdfbox.pdmodel.common.PDRectangle;
import com.tom_roush.pdfbox.pdmodel.graphics.image.PDImageXObject;
import com.tom_roush.pdfbox.util.Matrix;
import com.tom_roush.pdfbox.util.PDFBoxResourceLoader;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.channels.FileChannel;
import java.util.ArrayList;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicBoolean;


public class PdfCreator {


    private final float BORDER_K = 0.85f;

    private final AtomicBoolean stopCreation = new AtomicBoolean(false);
    private final Context mContext;
    private final ArrayList<String> mPictureList;
    private final String mDocumentPath;
    private final int mOptionsImageCompressQuality;
    private final String mOptionsTemporaryPath;
    private final String mPdfTemporaryOutputPath;


    public PdfCreator(Context context, ArrayList<String> pictureList, String documentPath, ReadableMap options) {
        mContext = context;
        mPictureList = pictureList;
        mDocumentPath = documentPath;
        mOptionsImageCompressQuality = options.getInt("optionsImageCompressQuality");
        mOptionsTemporaryPath = options.getString("optionsTemporaryPath");
        mPdfTemporaryOutputPath = new File(context.getCacheDir(), UUID.randomUUID().toString() + ".pdf").toString();
    }


    private int convertRotationToDegree(int orientation) {
        if (orientation == ExifInterface.ORIENTATION_ROTATE_90) {
            return 90;
        } else if (orientation == ExifInterface.ORIENTATION_ROTATE_180) {
            return 180;
        } else if (orientation == ExifInterface.ORIENTATION_ROTATE_270) {
            return 270;
        } else {
            return 0;
        }
    }

    private Pos getImagePosition(Size imageSize, PDPage page) {
        PDRectangle pageRectangle = page.getBBox();
        int posX = (int) ((pageRectangle.getWidth() - imageSize.width) / 2);
        int posY = (int) ((pageRectangle.getHeight() - imageSize.height) / 2);
        return new Pos(posX, posY);
    }

    private Size getImageNewSize(PDImageXObject image, PDPage page, int rotation) {
        PDRectangle pageRectangle = page.getBBox();

        int pageWidth = (int) pageRectangle.getWidth();
        int pageHeight = (int) pageRectangle.getHeight();
        int imageWidth = image.getWidth();
        int imageHeight = image.getHeight();

        if (rotation == 90 || rotation == 270) {
            imageWidth = image.getHeight();
            imageHeight = image.getWidth();
        }

        double imageAspectRatio = ((double) imageWidth / (double) imageHeight);
        int newImageWidth = imageWidth;
        int newImageHeight = imageHeight;

        if (imageWidth > (int) (pageWidth * BORDER_K)) {
            newImageWidth = (int) (pageWidth * BORDER_K);
            newImageHeight = (int) (newImageWidth / imageAspectRatio);
        }
        if (newImageHeight > (int) (pageHeight * BORDER_K)) {
            newImageHeight = (int) (pageHeight * BORDER_K);
            newImageWidth = (int) (newImageHeight * imageAspectRatio);
        }

        if (rotation == 90 || rotation == 270) {
            int switchSize = newImageWidth;
            newImageWidth = newImageHeight;
            newImageHeight = switchSize;
        }

        return new Size(newImageWidth, newImageHeight);
    }

    private void moveFile(String source, String destiny) throws IOException {
        File fileSource = new File(source);
        try (FileChannel channelInput = new FileInputStream(fileSource).getChannel()) {
            try (FileChannel channelOutput = new FileOutputStream(destiny).getChannel()) {
                channelInput.transferTo(0, fileSource.length(), channelOutput);
            }
        }
        fileSource.delete();
    }

    private void deleteTemporaryFile() {
        File temporaryFile = new File(mPdfTemporaryOutputPath);
        if (temporaryFile.exists()) {
            temporaryFile.delete();
        }
    }


    private String getFileExtension(String filePath) {
        String[] splitedFilePath = filePath.split("/");
        String fileName = splitedFilePath[splitedFilePath.length - 1];
        String[] splitedFileName = fileName.split("\\.");
        return splitedFileName[splitedFileName.length - 1];
    }

    private Bitmap.CompressFormat getBitmapFormatFromExtension(String extension) throws Exception {
        String lowercaseExtension = extension.toLowerCase();
        if (lowercaseExtension.equals("jpg") || lowercaseExtension.equals("jpeg")) {
            return Bitmap.CompressFormat.JPEG;
        } else if (lowercaseExtension.equals("png")) {
            return Bitmap.CompressFormat.PNG;
        }
        throw new Exception("Unsupported extension");
    }


    public boolean createPdf() throws Exception {
        PDFBoxResourceLoader.init(mContext);

        try (PDDocument file = new PDDocument()) {
            for (String pictureItem : mPictureList) {
                if (stopCreation.get()) {
                    file.close();
                    return false;
                }

                PDPage page = new PDPage(PDRectangle.A4);
                file.addPage(page);
                PDPageContentStream content = new PDPageContentStream(file, page);

                File fileImage = new File(pictureItem);
                if (mOptionsImageCompressQuality != 100) {
                    // Compress image
                    String pictureExtension = getFileExtension(pictureItem);
                    fileImage = new File(mOptionsTemporaryPath, UUID.randomUUID().toString() + "." + pictureExtension);
                    FileOutputStream fileOutputStreamImageCompressed = new FileOutputStream(fileImage);
                    Bitmap imageBitmap = BitmapFactory.decodeFile(pictureItem);
                    Bitmap.CompressFormat compressFormat = getBitmapFormatFromExtension(pictureExtension);
                    imageBitmap.compress(compressFormat, mOptionsImageCompressQuality, fileOutputStreamImageCompressed);
                    imageBitmap.recycle();
                    fileOutputStreamImageCompressed.close();

                    // Copy orientation metadata to compressed image
                    ExifInterface exifOriginal = new ExifInterface(pictureItem);
                    ExifInterface exifCompressed = new ExifInterface(fileImage.getPath());
                    exifCompressed.setAttribute(
                            ExifInterface.TAG_ORIENTATION,
                            exifOriginal.getAttribute(ExifInterface.TAG_ORIENTATION));
                    exifCompressed.saveAttributes();
                }

                PDImageXObject image = PDImageXObject.createFromFileByExtension(fileImage, file);
                Size imageSize = getImageNewSize(image, page, 0);
                Pos imagePosition = getImagePosition(imageSize, page);

                ExifInterface pictureExif = new ExifInterface(fileImage.getPath());
                int orientation = pictureExif.getAttributeInt(ExifInterface.TAG_ORIENTATION, ExifInterface.ORIENTATION_NORMAL);
                int rotationDegree = convertRotationToDegree(orientation);
                if (rotationDegree != 0) {
                    imageSize = getImageNewSize(image, page, 360 - rotationDegree);
                    imagePosition = getImagePosition(imageSize, page);

                    // Rotate image
                    PDRectangle cropBox = page.getCropBox();
                    float tx = (cropBox.getLowerLeftX() + cropBox.getUpperRightX()) / 2;
                    float ty = (cropBox.getLowerLeftY() + cropBox.getUpperRightY()) / 2;
                    content.transform(Matrix.getTranslateInstance(tx, ty));
                    content.transform(Matrix.getRotateInstance(Math.toRadians(360 - rotationDegree), 0, 0));
                    content.transform(Matrix.getTranslateInstance(-tx, -ty));
                }

                content.drawImage(image, imagePosition.x, imagePosition.y, imageSize.width, imageSize.height);
                content.close();

                if (mOptionsImageCompressQuality != 100) {
                    fileImage.delete();
                }
            }

            file.save(mPdfTemporaryOutputPath);
            file.close();

            if (stopCreation.get()) {
                deleteTemporaryFile();
                return false;
            }

            moveFile(mPdfTemporaryOutputPath, mDocumentPath);
            return true;
        } catch (Exception e) {
            deleteTemporaryFile();
            e.printStackTrace();
            throw e;
        }
    }

    public void stop() {
        stopCreation.set(true);
    }


    private static class Size {
        int width, height;

        Size(int width, int height) {
            this.width = width;
            this.height = height;
        }
    }

    private static class Pos {
        int x, y;

        public Pos(int x, int y) {
            this.x = x;
            this.y = y;
        }
    }
}
