package com.docscan.PdfCreator;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.graphics.pdf.PdfDocument;
import androidx.annotation.NonNull;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import java.io.File;
import java.io.FileOutputStream;


public class PdfCreator extends ReactContextBaseJavaModule {

    PdfCreator(ReactApplicationContext context) {
        super(context);
    }

    @NonNull
    @Override
    public String getName() {
        return "PdfCreator";
    }

    @ReactMethod
    public void exportPicturesToPdf(String documentPath, ReadableArray pictureList, Promise promise) {
        try {
            int a4Width = 596;
            int a4Height = 841;

            PdfDocument document = new PdfDocument();
            Paint paint = new Paint();

            for (int x = 0; x < pictureList.size(); x++) {
                // Create and start page
                PdfDocument.PageInfo pageInfo = new PdfDocument.PageInfo.Builder(a4Width, a4Height, 1).create();
                PdfDocument.Page page = document.startPage(pageInfo);

                // Create page content
                Canvas pageCanvas = page.getCanvas();
                Bitmap originalPicture = BitmapFactory.decodeFile(pictureList.getString(x));

                int originalPictureWidth = originalPicture.getWidth();
                int originalPictureHeight = originalPicture.getHeight();
                int ratio = originalPictureWidth / originalPictureHeight;
                int newWidth;
                int newHeight;
                if (originalPictureWidth > originalPictureHeight) {
                    newWidth = pageInfo.getPageWidth() - 20;
                    newHeight = newWidth / ratio;
                } else {
                    newHeight = pageInfo.getPageHeight() - 20;
                    newWidth = newHeight * ratio;
                }
                int posX = (pageInfo.getPageWidth() - newWidth) / 2;
                int posY = (pageInfo.getPageHeight() - newHeight) / 2;

                Bitmap scaledPicture = Bitmap.createScaledBitmap(originalPicture, newWidth, newHeight, false);
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
