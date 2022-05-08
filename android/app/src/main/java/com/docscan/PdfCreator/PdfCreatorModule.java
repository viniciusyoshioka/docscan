package com.docscan.PdfCreator;

import android.content.Intent;
import android.net.Uri;
import androidx.annotation.NonNull;
import androidx.core.content.FileProvider;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import java.io.File;


public class PdfCreatorModule extends ReactContextBaseJavaModule {


    private final ReactApplicationContext mReactApplicationContext;


    public PdfCreatorModule(ReactApplicationContext reactApplicationContext) {
        super(reactApplicationContext);
        mReactApplicationContext = reactApplicationContext;
    }


    @NonNull
    @Override
    public String getName() {
        return "PdfCreator";
    }


    @ReactMethod
    public void createPdf(ReadableArray pictureList, String documentPath, ReadableMap options) {
        Intent intent = new Intent(mReactApplicationContext, PdfCreatorService.class);
        intent.setAction(PdfCreatorService.ACTION_CREATE);
        intent.putExtra(PdfCreatorService.EXTRA_PICTURE_LIST, pictureList.toArrayList());
        intent.putExtra(PdfCreatorService.EXTRA_DOCUMENT_PATH, documentPath);
        intent.putExtra(PdfCreatorService.EXTRA_IMAGE_QUALITY, options.getInt("imageCompressQuality"));
        intent.putExtra(PdfCreatorService.EXTRA_TEMPORARY_PATH, options.getString("temporaryPath"));

        mReactApplicationContext.startService(intent);
    }


    @ReactMethod
    public void viewPdf(String filePath) {
        File file = new File(filePath);
        Uri fileUri = FileProvider.getUriForFile(mReactApplicationContext, mReactApplicationContext.getPackageName() + ".provider", file);

        Intent intent = new Intent(Intent.ACTION_VIEW);
        intent.setDataAndType(fileUri, "application/pdf");
        intent.addFlags(Intent.FLAG_ACTIVITY_NO_HISTORY);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);

        mReactApplicationContext.startActivity(intent);
    }
}
