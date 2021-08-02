package com.docscan.PdfCreator;

import android.content.Intent;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;


public class PdfCreatorModule extends ReactContextBaseJavaModule {


    private static final String MODULE_NAME = "PdfCreator";

    private final ReactContext mReactContext;


    PdfCreatorModule(ReactApplicationContext reactApplicationContext) {
        super(reactApplicationContext);
        mReactContext = reactApplicationContext;
    }


    @NonNull
    @Override
    public String getName() {
        return MODULE_NAME;
    }


    @ReactMethod
    public void createPdf(ReadableArray pictureList, String documentPath, ReadableMap options) {
        Intent intent = new Intent(mReactContext, PdfCreatorService.class);
        intent.setAction(PdfCreatorService.ACTION_CREATE);
        intent.putExtra("pictureList", pictureList.toArrayList());
        intent.putExtra("documentPath", documentPath);
        intent.putExtra("optionsImageCompressQuality", options.getInt("imageCompressQuality"));
        intent.putExtra("optionsTemporaryPath", options.getString("temporaryPath"));

        mReactContext.startService(intent);
    }
}
