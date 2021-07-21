package com.docscan.PdfCreator;

import android.app.Notification;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Intent;
import android.os.IBinder;

import androidx.annotation.Nullable;
import androidx.core.app.NotificationManagerCompat;

import com.docscan.R;

import java.util.ArrayList;


public class PdfCreatorService extends Service {


    public static final String ACTION_CREATE = "com.docscan.PdfCreator.PdfCreatorService.CREATE";
    public static final String ACTION_STOP = "com.docscan.PdfCreator.PdfCreatorService.STOP";
    private static final int NOTIFICATION_ID_SERVICE = 1;
    private static final int NOTIFICATION_ID_RESPONSE = 2;

    private PdfCreator pdfCreator;


    private Notification createServiceNotification() {
        Intent intent = new Intent(getApplicationContext(), PdfCreatorService.class);
        intent.setAction(ACTION_STOP);
        PendingIntent pendingIntent = PendingIntent.getService(getApplicationContext(), 0, intent, PendingIntent.FLAG_CANCEL_CURRENT);
        Notification.Action action = new Notification.Action(0, "Cancelar", pendingIntent);

        return new Notification.Builder(getApplicationContext())
                .setSmallIcon(R.mipmap.ic_launcher)
                .setContentTitle("DocScan")
                .setContentText("Convertendo documento em PDF")
                .addAction(action)
                .setProgress(0, 0, true)
                .setOngoing(true)
                .setCategory(Notification.CATEGORY_PROGRESS)
                .build();
    }

    private void sendResponseNotification(boolean success) {
        String notificationText = "Conversão concluída";
        if (!success) {
            notificationText = "Falha durante conversão";
        }

        Notification notification = new Notification.Builder(getApplicationContext())
                .setSmallIcon(R.mipmap.ic_launcher)
                .setContentTitle("DocScan")
                .setContentText(notificationText)
                .setCategory(Notification.CATEGORY_STATUS)
                .build();

        NotificationManagerCompat notificationManagerCompat = NotificationManagerCompat.from(getApplicationContext());
        notificationManagerCompat.notify(NOTIFICATION_ID_RESPONSE, notification);
    }


    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        String action = intent.getAction();

        if (action.equals(ACTION_STOP)) {
            pdfCreator.stop();
            stopForeground(true);
            stopSelf();
            return START_STICKY;
        }

        Notification serviceNotification = createServiceNotification();
        startForeground(NOTIFICATION_ID_SERVICE, serviceNotification);

        ArrayList<String> pictureList = intent.getStringArrayListExtra("pictureList");
        String documentPath = intent.getStringExtra("documentPath");

        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    pdfCreator = new PdfCreator(getApplicationContext(), pictureList, documentPath);
                    boolean done = pdfCreator.createPdf();
                    if (done) {
                        sendResponseNotification(true);
                    }

                    stopForeground(true);
                    stopSelf();
                } catch (Exception e) {
                    sendResponseNotification(false);

                    stopForeground(true);
                    stopSelf();
                }
            }
        }).start();

        return START_STICKY;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        pdfCreator.stop();
        stopForeground(true);
        stopSelf();
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
}
