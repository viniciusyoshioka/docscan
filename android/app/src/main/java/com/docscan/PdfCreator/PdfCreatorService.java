package com.docscan.PdfCreator;

import android.annotation.SuppressLint;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.media.RingtoneManager;
import android.net.Uri;
import android.os.Build;
import android.os.IBinder;
import android.util.Log;
import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;
import com.docscan.R;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import java.util.ArrayList;


public class PdfCreatorService extends Service {


    public static final String ACTION_CREATE = "com.docscan.PdfCreator.PdfCreatorService.CREATE";
    public static final String ACTION_STOP = "com.docscan.PdfCreator.PdfCreatorService.STOP";

    public static final String EXTRA_PICTURE_LIST = "com.docscan.PdfCreator.PdfCreatorService.PICTURE_LIST";
    public static final String EXTRA_DOCUMENT_PATH = "com.docscan.PdfCreator.PdfCreatorService.DOCUMENT_PATH";
    public static final String EXTRA_IMAGE_QUALITY = "com.docscan.PdfCreator.PdfCreatorService.IMAGE_QUALITY";
    public static final String EXTRA_TEMPORARY_PATH = "com.docscan.PdfCreator.PdfCreatorService.TEMPORARY_PATH";

    private static final int NOTIFICATION_ID_SERVICE = 1;
    private static final int NOTIFICATION_ID_RESPONSE = 2;
    private static final String NOTIFICATION_CHANNEL = "com.docscan.PdfCreator.PdfCreatorService.NOTIFICATION_CHANNEL";

    private NotificationManager notificationManager = null;
    private NotificationCompat.Builder notificationServiceBuilder = null;
    @Nullable private PdfCreator pdfCreator = null;


    @SuppressLint("UnspecifiedImmutableFlag")
    private void createServiceNotification() {
        Intent intent = new Intent(getApplicationContext(), PdfCreatorService.class);
        intent.setAction(ACTION_STOP);

        PendingIntent pendingIntent;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            pendingIntent = PendingIntent.getService(getApplicationContext(), 0, intent, PendingIntent.FLAG_CANCEL_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        } else {
            pendingIntent = PendingIntent.getService(getApplicationContext(), 0, intent, PendingIntent.FLAG_CANCEL_CURRENT);
        }
        NotificationCompat.Action action = new NotificationCompat.Action(0, "Cancelar", pendingIntent); // TODO add internationalization

        notificationServiceBuilder = new NotificationCompat.Builder(getApplicationContext(), NOTIFICATION_CHANNEL)
                .setSmallIcon(R.mipmap.ic_launcher) // TODO update notification icon
                .setContentTitle("DocScan") // TODO add internationalization
                .setContentText("Convertendo documento em PDF") // TODO add internationalization
                .addAction(action)
                .setProgress(0, 0, true)
                .setOngoing(true);
    }

    private void sendResponseNotification(boolean success) {
        String notificationText = success ? "Conversão concluída" : "Falha durante conversão"; // TODO add internationalization

        Uri notificationSoundUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);

        Notification notification = new NotificationCompat.Builder(getApplicationContext(), NOTIFICATION_CHANNEL)
                .setSmallIcon(R.mipmap.ic_launcher) // TODO update notification icon
                .setContentTitle("DocScan") // TODO add internationalization
                .setContentText(notificationText)
                .setSound(notificationSoundUri)
                .build();

        notificationManager.notify(NOTIFICATION_ID_RESPONSE, notification);
    }


    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if (intent == null) {
            Log.w("PdfCreatorService", "PdfCreatorService must have an intent, received null");
            return START_STICKY;
        }

        String action = intent.getAction();
        if (action == null) {
            Log.w("PdfCreatorService", "PdfCreatorService must have an action set, received null");
            return START_STICKY;
        }

        if (action.equals(ACTION_STOP)) {
            if (pdfCreator != null) {
                pdfCreator.stop();
            }
            stopForeground(true);
            stopSelf();
            return START_STICKY;
        }

        ArrayList<String> pictureList = intent.getStringArrayListExtra(EXTRA_PICTURE_LIST);
        String documentPath = intent.getStringExtra(EXTRA_DOCUMENT_PATH);
        int optionsImageCompressQuality = intent.getIntExtra(EXTRA_IMAGE_QUALITY, 100);
        String optionsTemporaryPath = intent.getStringExtra(EXTRA_TEMPORARY_PATH);

        if (pictureList == null) {
            Log.w("PdfCreatorService", "pictureList cannot be null");
            return START_STICKY;
        }
        if (documentPath == null) {
            Log.w("PdfCreatorService", "documentPath cannot be null");
            return START_STICKY;
        }
        if (optionsTemporaryPath == null) {
            Log.w("PdfCreatorService", "optionsTemporaryPath cannot be null");
            return START_STICKY;
        }

        notificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel notificationChannel = new NotificationChannel(NOTIFICATION_CHANNEL, NOTIFICATION_CHANNEL, NotificationManager.IMPORTANCE_DEFAULT);

            if (notificationManager != null) {
                notificationManager.createNotificationChannel(notificationChannel);
            }
        }

        createServiceNotification();
        startForeground(NOTIFICATION_ID_SERVICE, notificationServiceBuilder.build());

        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    WritableMap options = Arguments.createMap();
                    options.putInt(PdfCreator.KEY_IMAGE_QUALITY, optionsImageCompressQuality);
                    options.putString(PdfCreator.KEY_TEMPORARY_PATH, optionsTemporaryPath);

                    pdfCreator = new PdfCreator(getApplicationContext(), pictureList, documentPath, options);
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

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
}
