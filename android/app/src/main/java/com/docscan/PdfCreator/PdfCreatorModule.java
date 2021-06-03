package com.docscan.PdfCreator;

import android.os.AsyncTask;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableMap;

import java.lang.ref.WeakReference;


public class PdfCreatorModule extends ReactContextBaseJavaModule {


    String REACT_CLASS = "PdfCreator";

    ReactContext mReactContext;


    PdfCreatorModule(ReactApplicationContext reactApplicationContext) {
        super(reactApplicationContext);
        mReactContext = reactApplicationContext;
    }


    @NonNull
    @Override
    public String getName() {
        return REACT_CLASS;
    }


    @ReactMethod
    public void convertPicturesToPdf(ReadableArray pictureList, @Nullable String documentPath, Promise promise) {
        PdfCreator pdfCreator = new PdfCreator(mReactContext, pictureList, documentPath);
        pdfCreator.setOnConvertComplete(new PdfCreator.OnConvertComplete() {
            @Override
            public void onConvertComplete(WritableMap response) {
                promise.resolve(response);
            }
        });
        pdfCreator.setOnConvertFailure(new PdfCreator.OnConvertFailure() {
            @Override
            public void onConvertFailure(String message) {
                promise.reject("ConvertError", message);
            }
        });

        WeakReference<PdfCreatorTask> pdfCreatorTask = new WeakReference<>(new PdfCreatorTask(pdfCreator));
        pdfCreatorTask.get().executeOnExecutor(AsyncTask.THREAD_POOL_EXECUTOR);
    }
}
