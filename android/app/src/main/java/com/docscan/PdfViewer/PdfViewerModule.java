package com.docscan.PdfViewer;

import android.content.Intent;
import android.net.Uri;

import androidx.annotation.NonNull;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.io.File;


public class PdfViewerModule extends ReactContextBaseJavaModule {


    String REACT_CLASS = "PdfViewer";

    ReactContext mReactContext;


    PdfViewerModule(ReactApplicationContext reactApplicationContext) {
        super(reactApplicationContext);
        mReactContext = reactApplicationContext;
    }


    @NonNull
    @Override
    public String getName() {
        return REACT_CLASS;
    }


    @ReactMethod
    public void openPdf(String path) {
        File file = new File(path);
        Uri filePathUri = Uri.fromFile(file);

        Intent intent = new Intent(Intent.ACTION_VIEW);
        intent.setDataAndType(filePathUri, "application/pdf");
        intent.setFlags(Intent.FLAG_ACTIVITY_NO_HISTORY | Intent.FLAG_ACTIVITY_NEW_TASK);

         mReactContext.startActivity(intent);
    }
}
