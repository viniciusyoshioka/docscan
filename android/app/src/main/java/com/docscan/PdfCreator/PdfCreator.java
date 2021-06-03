package com.docscan.PdfCreator;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Matrix;
import android.graphics.Paint;
import android.graphics.pdf.PdfDocument;
import android.media.ExifInterface;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableMap;

import java.io.File;
import java.io.FileOutputStream;
import java.util.UUID;


public class PdfCreator {


    private final int A4_WIDTH = 595; // 596
    private final int A4_HEIGHT = 840; // 841
    private final int BORDER_SIZE = 25;

    private final ReactContext mReactContext;
    private final ReadableArray mPictureList;
    private final @Nullable String mDocumentPath;
    private OnConvertComplete mOnConvertComplete;
    private OnConvertFailure mOnConvertFailure;


    public PdfCreator(ReactContext reactContext, ReadableArray pictureList, @Nullable String documentPath) {
        mReactContext = reactContext;
        mPictureList = pictureList;
        mDocumentPath = documentPath;
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

        // int newImageWidth = pageInfo.getPageWidth() - (borderSize * 2);
        // int newImageHeight = pageInfo.getPageHeight() - (borderSize * 2);
        int newImageWidth = 0;
        int newImageHeight = 0;

        /*
        if (originalImageWidth > pageInfo.getPageWidth() - (borderSize * 2)) {
            newImageWidth = pageInfo.getPageWidth() - (borderSize * 2);
            newImageHeight = (newImageWidth * originalImageHeight) / originalImageWidth;
        }
        if (newImageHeight > pageInfo.getPageHeight() - (borderSize * 2)) {
            newImageHeight = pageInfo.getPageHeight() - (borderSize * 2);
            newImageWidth = (newImageHeight * originalImageWidth) / originalImageHeight;
        }
        */
        if (originalImageWidth > pageInfo.getPageWidth() - (BORDER_SIZE * 2)) {
            newImageWidth = pageInfo.getPageWidth() - (BORDER_SIZE * 2);
            newImageHeight = (int) (newImageWidth / imageAspectRatio);
        } else if (originalImageHeight > pageInfo.getPageHeight() - (BORDER_SIZE * 2)) {
            newImageHeight = pageInfo.getPageHeight() - (BORDER_SIZE * 2);
            newImageWidth = (int) (newImageHeight * imageAspectRatio);
        }

        return new Size(newImageWidth, newImageHeight);
    }


    public void convertPicturesToPdf() {
        String destinyPath;
        if (mDocumentPath == null) {
            destinyPath = new File(mReactContext.getCacheDir().toURI().toString(), UUID.randomUUID() + ".pdf")
                    .toURI()
                    .toString();
        } else {
            destinyPath = mDocumentPath;
        }

        try {
            PdfDocument document = new PdfDocument();
            Paint paint = new Paint();

            for (int x = 0; x < mPictureList.size(); x++) {
                // Create and start page
                PdfDocument.PageInfo pageInfo = new PdfDocument.PageInfo.Builder(A4_WIDTH, A4_HEIGHT, 1).create();
                PdfDocument.Page page = document.startPage(pageInfo);

                // Create page content
                Canvas pageCanvas = page.getCanvas();
                Bitmap originalPicture = BitmapFactory.decodeFile(mPictureList.getString(x));

                // Get exif orientation
                ExifInterface pictureExif = new ExifInterface(mPictureList.getString(x));
                int pictureOrientation = pictureExif.getAttributeInt(ExifInterface.TAG_ORIENTATION, ExifInterface.ORIENTATION_NORMAL);
                int pictureRotation = convertRotationToDegree(pictureOrientation);
                Matrix matrix = new Matrix();
                if (pictureOrientation != 0) {
                    matrix.preRotate(pictureRotation);
                }
                originalPicture = Bitmap.createBitmap(
                        originalPicture,
                        0,
                        0,
                        originalPicture.getWidth(),
                        originalPicture.getHeight(),
                        matrix,
                        false);

                // Resize image
                Size newImageSize;
                if ((originalPicture.getWidth() > (pageCanvas.getWidth() - (BORDER_SIZE * 2))) || (originalPicture.getHeight() > (pageCanvas.getHeight() - (BORDER_SIZE * 2)))) {
                    newImageSize = resizeImage(originalPicture, pageInfo);
                } else {
                    newImageSize = new Size(originalPicture.getWidth(), originalPicture.getHeight());
                }
                Bitmap scaledPicture = Bitmap.createScaledBitmap(
                        originalPicture,
                        newImageSize.width,
                        newImageSize.height,
                        false);
                // Get image position
                int posX = (pageInfo.getPageWidth() - newImageSize.width) / 2;
                int posY = (pageInfo.getPageHeight() - newImageSize.height) / 2;
                // Draw image
                pageCanvas.drawBitmap(scaledPicture, posX, posY, paint);

                // Finish page
                document.finishPage(page);
            }

            // Write file
            File file = new File(destinyPath);
            document.writeTo(new FileOutputStream(file));

            // Close file
            document.close();

            // Return result
            OnConvertComplete listener = mOnConvertComplete;
            if (listener != null) {
                WritableMap response = Arguments.createMap();
                response.putString("uri", mDocumentPath);

                listener.onConvertComplete(response);
            }
        } catch (Exception e) {
            OnConvertFailure listener = mOnConvertFailure;
            if (listener != null) {
                listener.onConvertFailure(e.getMessage());
            }
        }
    }


    public void setOnConvertComplete(OnConvertComplete listener) {
        mOnConvertComplete = listener;
    }

    public void setOnConvertFailure(OnConvertFailure listener) {
        mOnConvertFailure = listener;
    }


    public interface OnConvertComplete {
        void onConvertComplete(WritableMap response);
    }

    public interface OnConvertFailure {
        void onConvertFailure(String message);
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
