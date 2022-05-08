package com.docscan.PdfCreator;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.util.Log;
import androidx.exifinterface.media.ExifInterface;
import com.facebook.react.bridge.WritableMap;
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


    public static final String KEY_IMAGE_QUALITY = "com.docscan.PdfCreator.IMAGE_QUALITY";
    public static final String KEY_TEMPORARY_PATH = "com.docscan.PdfCreator.TEMPORARY_PATH";

    private static final float BORDER = 0.85f;


    private final Context mContext;
    private final ArrayList<String> mPictureList;
    private final String mDocumentPath;
    private final int mOptionsImageCompressQuality;
    private final String mOptionsTemporaryPath;
    private final String mPdfTemporaryOutputPath;
    private final AtomicBoolean stopCreation = new AtomicBoolean(false);


    public PdfCreator(Context context, ArrayList<String> pictureList, String documentPath, WritableMap options) {
        mContext = context;
        mPictureList = pictureList;
        mDocumentPath = documentPath;
        mOptionsImageCompressQuality = options.getInt(KEY_IMAGE_QUALITY);
        mOptionsTemporaryPath = options.getString(KEY_TEMPORARY_PATH);
        mPdfTemporaryOutputPath = new File(context.getCacheDir(), UUID.randomUUID().toString() + ".pdf").toString();
    }


    private int convertRotationToDegree(int orientation) {
        switch (orientation) {
            case ExifInterface.ORIENTATION_ROTATE_90:
                return 90;
            case ExifInterface.ORIENTATION_ROTATE_180:
                return 180;
            case ExifInterface.ORIENTATION_ROTATE_270:
                return 270;
            default:
                return 0;
        }
    }

    private Pos getImagePosition(Size imageSize, PDPage page) {
        PDRectangle pageRectangle = page.getBBox();
        int posX = (int) ((pageRectangle.getWidth() - imageSize.getWidth()) / 2);
        int posY = (int) ((pageRectangle.getHeight() - imageSize.getHeight()) / 2);
        return new Pos(posX, posY);
    }

    private Size getImageNewSize(PDImageXObject image, PDPage page, int rotation) {
        int pageWidth = (int) page.getBBox().getWidth();
        int pageHeight = (int) page.getBBox().getHeight();
        int imageWidth = image.getWidth();
        int imageHeight = image.getHeight();

        if (rotation == 90 || rotation == 270) {
            imageWidth = image.getHeight();
            imageHeight = image.getWidth();
        }

        double imageAspectRatio = (double) imageWidth / (double) imageHeight;
        int newImageWidth = imageWidth;
        int newImageHeight = imageHeight;

        if (imageWidth > (int) (pageWidth * BORDER)) {
            newImageWidth = (int) (pageWidth * BORDER);
            newImageHeight = (int) (newImageWidth / imageAspectRatio);
        }
        if (newImageHeight > (int) (pageHeight * BORDER)) {
            newImageHeight = (int) (pageHeight * BORDER);
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
                Log.w("PdfCreator", String.format("File '%s' moved to '%s'", source, destiny));
            }
        }

        boolean isFileDeleted = fileSource.delete();
        Log.w("PdfCreator", String.format("Original file (%s) deleted after moving it: %b", source, isFileDeleted));
    }

    private void deleteTemporaryFile() {
        File temporaryFile = new File(mPdfTemporaryOutputPath);
        if (temporaryFile.exists()) {
            boolean isTemporaryFileDeleted = temporaryFile.delete();
            Log.w("PdfCreator", String.format("Temporary file deleted: %b", isTemporaryFileDeleted));
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

        try {
            PDDocument file = new PDDocument();

            if (mPictureList == null) {
                file.close();
                return false;
            }

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
                    float tx = (page.getCropBox().getLowerLeftX() + page.getCropBox().getUpperRightX()) / 2;
                    float ty = (page.getCropBox().getLowerLeftY() + page.getCropBox().getUpperRightY()) / 2;
                    content.transform(Matrix.getTranslateInstance(tx, ty));
                    content.transform(Matrix.getRotateInstance(Math.toRadians(360 - rotationDegree), 0f, 0f));
                    content.transform(Matrix.getTranslateInstance(-tx, -ty));
                }

                content.drawImage(
                        image,
                        (float) imagePosition.getX(),
                        (float) imagePosition.getY(),
                        (float) imageSize.mWidth,
                        (float) imageSize.mHeight
                );
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
        private final int mWidth;
        private final int mHeight;

        public Size(int width, int height) {
            mWidth = width;
            mHeight = height;
        }

        public int getWidth() {
            return mWidth;
        }

        public int getHeight() {
            return mHeight;
        }
    }

    private static class Pos {
        private final int mX;
        private final int mY;

        public Pos(int x, int y) {
            mX = x;
            mY = y;
        }

        public int getX() {
            return mX;
        }

        public int getY() {
            return mY;
        }
    }
}
