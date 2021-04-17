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
    public void exportPicturesToPdf(ReadableArray pictureList, @Nullable String documentPath, Promise promise) {
        PdfCreator pdfCreator = new PdfCreator(mReactContext, pictureList, documentPath);
        pdfCreator.setOnExportComplete(new PdfCreator.OnExportComplete() {
            @Override
            public void onExportComplete(WritableMap response) {
                promise.resolve(response);
            }
        });
        pdfCreator.setOnExportFailure(new PdfCreator.OnExportFailure() {
            @Override
            public void onExportFailure(String message) {
                promise.reject("ExportError", message);
            }
        });

        WeakReference<PdfCreatorTask> pdfCreatorTask = new WeakReference<>(new PdfCreatorTask(pdfCreator));
        pdfCreatorTask.get().executeOnExecutor(AsyncTask.THREAD_POOL_EXECUTOR);
    }
}
