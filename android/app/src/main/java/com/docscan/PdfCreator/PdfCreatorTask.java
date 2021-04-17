package com.docscan.PdfCreator;

import android.os.AsyncTask;


public class PdfCreatorTask extends AsyncTask<Void, Void, Void> {


    PdfCreator mPdfCreator;


    public PdfCreatorTask(PdfCreator pdfCreator) {
        mPdfCreator = pdfCreator;
    }


    @Override
    protected Void doInBackground(Void... params) {
        mPdfCreator.exportPicturesToPdf();
        return null;
    }
}
