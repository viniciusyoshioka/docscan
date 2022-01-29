package com.docscan.DocumentService;

import android.annotation.SuppressLint;
import android.app.Service;
import android.content.Intent;
import android.os.IBinder;
import android.util.Log;
import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;
import com.docscan.R;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.concurrent.atomic.AtomicBoolean;


public class DocumentServiceService extends Service {


    public static final String ACTION_DELETE = "com.docscan.DocumentService.DocumentServiceService.DELETE";
    public static final String ACTION_COPY = "com.docscan.DocumentService.DocumentServiceService.COPY";
    public static final String ACTION_MOVE = "com.docscan.DocumentService.DocumentServiceService.MOVE";

    public static final String EXTRA_NOTIFICATION_TITLE = "notificationTitle";
    public static final String EXTRA_PICTURES_ARRAY = "picturesArray";

    private static final int NOTIFICATION_ID = 1;
    private static final String NOTIFICATION_CHANNEL = "DOCUMENT_SERVICE_NOTIFICATION_CHANNEL";
    private NotificationManagerCompat notificationManagerCompat;
    private NotificationCompat.Builder notificationBuilder;
    private final AtomicBoolean isServiceRunning = new AtomicBoolean(false);
    private final ArrayList<Runnable> serviceQueue = new ArrayList<>();


    private void createNotification() {
        notificationBuilder = new NotificationCompat.Builder(this, NOTIFICATION_CHANNEL)
                .setSmallIcon(R.drawable.ic_stat_name) // TODO
                .setContentTitle("DocScan")
                .setProgress(0, 0, true)
                .setOngoing(true);
    }

    private void updateNotificationTitle(String newTitle) {
        if (notificationBuilder != null) {
            notificationBuilder.setContentTitle(newTitle);
            notificationManagerCompat.notify(NOTIFICATION_ID, notificationBuilder.build());
        }
    }

    @SuppressLint("DefaultLocale")
    private void updateNotificationProgress(int current, int total) {
        if (notificationBuilder != null) {
            notificationBuilder.setProgress(total, current, false);
            notificationBuilder.setContentText(String.format("%d de %d", current, total));
            notificationManagerCompat.notify(NOTIFICATION_ID, notificationBuilder.build());
        }
    }


    private void onServiceStart() {
        isServiceRunning.set(true);
    }

    private void onServiceEnd() {
        stopForeground(true);
        stopSelf();
        isServiceRunning.set(false);
    }


    protected void deletePictures(ArrayList<String> picturesToDelete) {
        Log.d("DocumentServiceService", "onStart deletePictures");

        for (int i = 0; i < picturesToDelete.size(); i++) {
            updateNotificationProgress((i + 1), picturesToDelete.size());

            try {
                String picturePath = picturesToDelete.get(i);
                Log.d("DocumentServiceService", String.format("Deleting image %d/%d. File name: %s", i + 1, picturesToDelete.size(), picturePath));

                boolean isFileDeleted = new File(picturePath).delete();
                Log.d("DocumentServiceService", String.format("File %d/%d deletion check. Was file deleted = %b", i + 1, picturesToDelete.size(), isFileDeleted));
            } catch (Exception e) {
                Log.w("DocumentServiceService", String.format("deletePicture: Exception thrown. Error ignored. '%s'", e.getMessage()));
                e.printStackTrace();
            }
        }

        Log.d("DocumentServiceService", "onEnd deletePictures");
    }

    protected void copyPictures(ArrayList<String> picturesToCopy) {
        Log.d("DocumentServiceService", "onStart copyPictures");

        int totalFiles = picturesToCopy.size() / 2;
        for (int i = 0; i < picturesToCopy.size(); i += 2) {
            int currentFile = (i / 2) + 1;

            updateNotificationProgress(currentFile, totalFiles);

            File pictureFileFrom = new File(picturesToCopy.get(i));
            String picturePathTo = picturesToCopy.get(i + 1);

            try {
                Log.d("DocumentServiceService", String.format("Copying file %d/%d. From '%s' to '%s'", currentFile, totalFiles, picturesToCopy.get(i), picturesToCopy.get(i + 1)));
                FileInputStream fileInputStream = new FileInputStream(pictureFileFrom);
                FileOutputStream fileOutputStream = new FileOutputStream(picturePathTo);
                fileInputStream.getChannel().transferTo(0, pictureFileFrom.length(), fileOutputStream.getChannel());
                fileInputStream.close();
                fileOutputStream.close();
                Log.d("DocumentServiceService", String.format("File copied %d/%d", currentFile, totalFiles));
            } catch (IOException e) {
                Log.w("DocumentServiceService", String.format("copyPictures: IOException thrown. Error ignored. '%s'", e.getMessage()));
                e.printStackTrace();
            }
        }

        Log.d("DocumentServiceService", "onEnd copyPictures");
    }

    protected void movePictures(ArrayList<String> picturesToMove) {
        Log.d("DocumentServiceService", "onStart movePictures");

        int totalFiles = picturesToMove.size() / 2;
        for (int i = 0; i < picturesToMove.size(); i += 2) {
            int currentFile = (i / 2) + 1;

            updateNotificationProgress(currentFile, totalFiles);

            File pictureFileFrom = new File(picturesToMove.get(i));
            String picturePathTo = picturesToMove.get(i + 1);

            try {
                Log.d("DocumentServiceService", String.format("Copying (to move) file %d/%d. From '%s' to '%s'", currentFile, totalFiles, picturesToMove.get(i), picturesToMove.get(i + 1)));
                FileInputStream fileInputStream = new FileInputStream(pictureFileFrom);
                FileOutputStream fileOutputStream = new FileOutputStream(picturePathTo);
                fileInputStream.getChannel().transferTo(0, pictureFileFrom.length(), fileOutputStream.getChannel());
                fileInputStream.close();
                fileOutputStream.close();
                Log.d("DocumentServiceService", String.format("File copied (to move) %d/%d", currentFile, totalFiles));
                boolean isFromFileDeleted = pictureFileFrom.delete();
                Log.d("DocumentServiceService", String.format("Check source file deletion in moving process. Was file deleted = %b", isFromFileDeleted));
            } catch (Exception e) {
                Log.w("DocumentServiceService", String.format("movePictures: IOException thrown. Error ignored. '%s'", e.getMessage()));
                e.printStackTrace();
            }
        }

        Log.d("DocumentServiceService", "onEnd movePictures");
    }


    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        String action = intent.getAction();
        if (action == null) {
            Log.w("DocumentServiceService", "DocumentServiceService must have an action set, received null");
            return START_STICKY;
        }

        ArrayList<String> picturesArray = intent.getStringArrayListExtra(EXTRA_PICTURES_ARRAY);
        if ((action.equals(ACTION_COPY) || action.equals(ACTION_MOVE)) && (picturesArray.size() % 2 != 0)) {
            Log.w("DocumentServiceService", "DocumentServiceService onStartCommand: Picture array must be pair when action is COPY or MOVE");
            return START_STICKY;
        }

        switch (action) {
            case ACTION_DELETE:
                serviceQueue.add(new Runnable() {
                    @Override
                    public void run() {
                        String serviceNotificationTitle = intent.getStringExtra(EXTRA_NOTIFICATION_TITLE);
                        updateNotificationTitle(serviceNotificationTitle);
                        deletePictures(picturesArray);
                    }
                });
                Log.i("DocumentServiceService", "Added deletePictures service operation to the queue");
                break;
            case ACTION_COPY:
                serviceQueue.add(new Runnable() {
                    @Override
                    public void run() {
                        String serviceNotificationTitle = intent.getStringExtra(EXTRA_NOTIFICATION_TITLE);
                        updateNotificationTitle(serviceNotificationTitle);
                        copyPictures(picturesArray);
                    }
                });
                Log.i("DocumentServiceService", "Added copyPictures service operation to the queue");
                break;
            case ACTION_MOVE:
                serviceQueue.add(new Runnable() {
                    @Override
                    public void run() {
                        String serviceNotificationTitle = intent.getStringExtra(EXTRA_NOTIFICATION_TITLE);
                        updateNotificationTitle(serviceNotificationTitle);
                        movePictures(picturesArray);
                    }
                });
                Log.i("DocumentServiceService", "Added movePictures service operation to the queue");
                break;
        }

        if (isServiceRunning.get()) {
            Log.i("DocumentServiceService", "Service already running. Waiting it finish to start the next in queue");
            return START_STICKY;
        }

        notificationManagerCompat = NotificationManagerCompat.from(getApplicationContext());
        createNotification();
        startForeground(NOTIFICATION_ID, notificationBuilder.build());

        new Thread(new Runnable() {
            @SuppressLint("DefaultLocale")
            @Override
            public void run() {
                onServiceStart();

                //Log.println(Log.ASSERT, "DocumentServiceService", String.format("Service queue has %d items initially", serviceQueue.size()));
                Log.d("DocumentServiceService", String.format("Service queue has %d items initially", serviceQueue.size()));
                while (serviceQueue.size() > 0) {
                    //Log.println(Log.ASSERT, "DocumentServiceService", String.format("Preparing to execute next service in a total of %d", serviceQueue.size()));
                    Log.d("DocumentServiceService", String.format("Preparing to execute next service in a total of %d", serviceQueue.size()));

                    Runnable nextService = serviceQueue.get(0);
                    serviceQueue.remove(0);

                    //Log.println(Log.ASSERT, "DocumentServiceService", String.format("First service queue item has been obtained to be run. %d remaining.", serviceQueue.size()));
                    Log.d("DocumentServiceService", String.format("First service queue item has been obtained to be run. %d remaining.", serviceQueue.size()));
                    nextService.run();
                }

                onServiceEnd();
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
