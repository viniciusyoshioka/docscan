package com.docscan.PdfCreator;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Matrix;
import android.graphics.Paint;
import android.graphics.pdf.PdfDocument;
import android.media.ExifInterface;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.channels.FileChannel;
import java.util.ArrayList;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicBoolean;


public class PdfCreator {


    private final int A4_WIDTH = 595;
    private final int A4_HEIGHT = 842;
    private final int PAGE_COUNT = 1;
    private final float BORDER_K = 0.85f;

    private final AtomicBoolean stopCreation = new AtomicBoolean(false);
    private final Context mContext;
    private final ArrayList<String> mPictureList;
    private final String mDocumentPath;
    private final String mTemporaryOutputPath;


    public PdfCreator(Context context, ArrayList<String> pictureList, String documentPath) {
        mContext = context;
        mPictureList = pictureList;
        mDocumentPath = documentPath;
        mTemporaryOutputPath = new File(context.getCacheDir(), UUID.randomUUID().toString() + ".pdf").toString();
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

    private Size resizeImage(Bitmap originalImage, PdfDocument.PageInfo pageInfo) {
        int originalImageWidth = originalImage.getWidth();
        int originalImageHeight = originalImage.getHeight();
        float imageAspectRatio = (float) originalImageWidth / originalImageHeight;

        int newImageWidth = 0;
        int newImageHeight = 0;

        if (originalImageWidth > pageInfo.getPageWidth() * BORDER_K) {
            newImageWidth = (int) (pageInfo.getPageWidth() * BORDER_K);
            newImageHeight = (int) (newImageWidth / imageAspectRatio);
        }
        if (newImageHeight > pageInfo.getPageHeight() * BORDER_K) {
            newImageHeight = (int) (pageInfo.getPageHeight() * BORDER_K);
            newImageWidth = (int) (newImageHeight * imageAspectRatio);
        }

        return new Size(newImageWidth, newImageHeight);
    }

    private void moveFile(String source, String destiny) throws IOException {
        File fileSource = new File(source);
        FileChannel channelInput = new FileInputStream(fileSource).getChannel();
        FileChannel channelOutput = new FileOutputStream(destiny).getChannel();
        channelInput.transferTo(0, fileSource.length(), channelOutput);
        channelInput.close();
        channelOutput.close();
        fileSource.delete();
    }


    public boolean createPdf() throws Exception {
        try {
            PdfDocument document = new PdfDocument();
            Paint paint = new Paint();

            for (String pictureItem : mPictureList) {
                if (stopCreation.get()) {
                    document.close();
                    return false;
                }

                // Create page
                PdfDocument.PageInfo pageInfo = new PdfDocument.PageInfo.Builder(
                        A4_WIDTH,
                        A4_HEIGHT,
                        PAGE_COUNT).create();
                PdfDocument.Page page = document.startPage(pageInfo);

                // Create page content
                Canvas pageCanvas = page.getCanvas();
                BitmapFactory.Options options = new BitmapFactory.Options();
                options.inPreferredConfig = Bitmap.Config.RGB_565;
                Bitmap originalPicture = BitmapFactory.decodeFile(pictureItem, options);

                // Fix image rotation
                ExifInterface pictureExif = new ExifInterface(pictureItem);
                int pictureOrientation = pictureExif.getAttributeInt(ExifInterface.TAG_ORIENTATION, ExifInterface.ORIENTATION_NORMAL);
                if (pictureOrientation != 0) {
                    Matrix matrix = new Matrix();
                    int pictureRotation = convertRotationToDegree(pictureOrientation);
                    matrix.preRotate(pictureRotation);
                    originalPicture = Bitmap.createBitmap(
                            originalPicture,
                            0,
                            0,
                            originalPicture.getWidth(),
                            originalPicture.getHeight(),
                            matrix,
                            false);
                }

                // Resize image
                if ((originalPicture.getWidth() >= (pageCanvas.getWidth() * BORDER_K)) || (originalPicture.getHeight() >= (pageCanvas.getHeight() * BORDER_K))) {
                    Size newImageSize = resizeImage(originalPicture, pageInfo);
                    Bitmap scaledPicture = Bitmap.createScaledBitmap(
                            originalPicture,
                            newImageSize.width,
                            newImageSize.height,
                            true);
                    // Get image position
                    int posX = (pageInfo.getPageWidth() - newImageSize.width) / 2;
                    int posY = (pageInfo.getPageHeight() - newImageSize.height) / 2;
                    // Draw image
                    pageCanvas.drawBitmap(scaledPicture, posX, posY, paint);
                } else {
                    // Get image position
                    int posX = (pageInfo.getPageWidth() - originalPicture.getWidth()) / 2;
                    int posY = (pageInfo.getPageHeight() - originalPicture.getHeight()) / 2;
                    // Draw image
                    pageCanvas.drawBitmap(originalPicture, posX, posY, paint);
                }

                // Finish page
                document.finishPage(page);
            }

            // Write file
            document.writeTo(new FileOutputStream(mTemporaryOutputPath));

            // Close file
            document.close();

            if (stopCreation.get()) {
                return false;
            }

            // Move file
            moveFile(mTemporaryOutputPath, mDocumentPath);

            return true;
        } catch (Exception e) {
            File temporaryFile = new File(mTemporaryOutputPath);
            if (temporaryFile.exists()) {
                temporaryFile.delete();
            }
            e.printStackTrace();
            throw e;
        }
    }

    public void stop() {
        stopCreation.set(true);
    }


    private static class Size {
        int width;
        int height;

        Size(int width, int height) {
            this.width = width;
            this.height = height;
        }
    }
}
