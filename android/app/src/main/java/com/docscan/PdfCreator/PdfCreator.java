package com.docscan.PdfCreator;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Matrix;
import android.graphics.Paint;
import android.graphics.pdf.PdfDocument;
import android.media.ExifInterface;
import androidx.annotation.NonNull;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import java.io.File;
import java.io.FileOutputStream;


class Size {
    int width;
    int height;

    Size(int width, int height) {
        this.width = width;
        this.height = height;
    }
}


public class PdfCreator extends ReactContextBaseJavaModule {

    int a4Width = 595; // 596
    int a4Height = 840; // 841
    int borderSize = 25;

    PdfCreator(ReactApplicationContext context) {
        super(context);
    }

    @NonNull
    @Override
    public String getName() {
        return "PdfCreator";
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

        int newImageWidth = pageInfo.getPageWidth() - (borderSize * 2);
        int newImageHeight = pageInfo.getPageHeight() - (borderSize * 2);

        if (originalImageWidth > pageInfo.getPageWidth() - (borderSize * 2)) {
            newImageWidth = pageInfo.getPageWidth() - (borderSize * 2);
            newImageHeight = (newImageWidth * originalImageHeight) / originalImageWidth;
        }

        if (newImageHeight > pageInfo.getPageHeight() - (borderSize * 2)) {
            newImageHeight = pageInfo.getPageHeight() - (borderSize * 2);
            newImageWidth = (newImageHeight * originalImageWidth) / originalImageHeight;
        }

        return new Size(newImageWidth, newImageHeight);
    }

    @ReactMethod
    public void exportPicturesToPdf(String documentPath, ReadableArray pictureList, Promise promise) {
        try {
            PdfDocument document = new PdfDocument();
            Paint paint = new Paint();

            for (int x = 0; x < pictureList.size(); x++) {
                // Create and start page
                PdfDocument.PageInfo pageInfo = new PdfDocument.PageInfo.Builder(a4Width, a4Height, 1).create();
                PdfDocument.Page page = document.startPage(pageInfo);

                // Create page content
                Canvas pageCanvas = page.getCanvas();
                Bitmap originalPicture = BitmapFactory.decodeFile(pictureList.getString(x));

                // Get exif orientation
                ExifInterface pictureExif = new ExifInterface(pictureList.getString(x));
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
                if ((originalPicture.getWidth() > (pageCanvas.getWidth() - (borderSize * 2))) || (originalPicture.getHeight() > (pageCanvas.getHeight() - (borderSize * 2)))) {
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
            File file = new File(documentPath);
            document.writeTo(new FileOutputStream(file));

            // Close file
            document.close();

            // Return result
            promise.resolve(true);
        } catch (Exception error) {
            promise.reject(error);
        }
    }
}
