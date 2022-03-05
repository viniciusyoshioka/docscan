package com.docscan.DocumentService;

import android.annotation.SuppressLint;
import android.app.Service;
import android.content.Intent;
import android.media.RingtoneManager;
import android.net.Uri;
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
import net.lingala.zip4j.model.ZipParameters;
import net.lingala.zip4j.model.enums.CompressionLevel;
import net.lingala.zip4j.model.enums.CompressionMethod;


public class DocumentServiceService extends Service {


    public static final String ACTION_DELETE = "com.docscan.DocumentService.DocumentServiceService.DELETE";
    public static final String ACTION_COPY = "com.docscan.DocumentService.DocumentServiceService.COPY";
    public static final String ACTION_MOVE = "com.docscan.DocumentService.DocumentServiceService.MOVE";
    public static final String ACTION_EXPORT = "com.docscan.DocumentService.DocumentServiceService.EXPORT";

    public static final String EXTRA_PICTURES_ARRAY = "picturesArray";
    public static final String EXTRA_DATABASE_PATH = "databasePath";
    public static final String EXTRA_PATH_ZIP_TO = "pathZipTo";
    public static final String EXTRA_PATH_EXPORTED_DOCUMENT = "pathExportedDocument";
    public static final String EXTRA_NOTIFICATION_TITLE = "notificationTitle";

    private static final int NOTIFICATION_ID_SERVICE = 1;
    private static final int NOTIFICATION_ID_RESPONSE = 2;
    private static final String NOTIFICATION_CHANNEL_SERVICE = "com.docscan.DocumentService.DocumentServiceService.NOTIFICATION_CHANNEL_SERVICE";
    private static final String NOTIFICATION_CHANNEL_RESPONSE = "com.docscan.DocumentService.DocumentServiceService.NOTIFICATION_CHANNEL_RESPONSE";

    private NotificationManagerCompat notificationManagerCompat;
    private NotificationCompat.Builder notificationServiceBuilder;
    private NotificationCompat.Builder notificationResponseBuilder;

    private final AtomicBoolean isServiceRunning = new AtomicBoolean(false);
    private final ArrayList<Runnable> serviceQueue = new ArrayList<>();


    private void createNotification() {
        notificationServiceBuilder = new NotificationCompat.Builder(this, NOTIFICATION_CHANNEL_SERVICE)
                .setSmallIcon(R.drawable.ic_stat_name) // TODO
                .setContentTitle("DocScan")
                .setProgress(0, 0, true)
                .setOngoing(true);
    }

    private void updateNotificationTitle(String newTitle) {
        if (notificationServiceBuilder != null) {
            notificationServiceBuilder.setContentTitle(newTitle);
            notificationManagerCompat.notify(NOTIFICATION_ID_SERVICE, notificationServiceBuilder.build());
        }
    }

    @SuppressLint("DefaultLocale")
    private void updateNotificationProgress(int current, int total) {
        if (notificationServiceBuilder != null) {
            notificationServiceBuilder.setProgress(total, current, false);
            notificationServiceBuilder.setContentText(String.format("%d de %d", current, total));
            notificationManagerCompat.notify(NOTIFICATION_ID_SERVICE, notificationServiceBuilder.build());
        }
    }


    private void createResponseNotification(String title, String text) {
        Uri notificationSoundUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);
        notificationResponseBuilder = new NotificationCompat.Builder(this, NOTIFICATION_CHANNEL_RESPONSE)
                .setSmallIcon(R.drawable.ic_stat_name) // TODO
                .setContentTitle(title)
                .setContentText(text)
                .setSound(notificationSoundUri);
    }

    private void sendResponseNotification() {
        if (notificationManagerCompat == null) {
            notificationManagerCompat = NotificationManagerCompat.from(getApplicationContext());
            Log.d("DocumentServiceService", "Notification manager compat didn't existed, created successfully to send response notification");
        }
        if (notificationResponseBuilder != null) {
            notificationManagerCompat.notify(NOTIFICATION_ID_RESPONSE, notificationResponseBuilder.build());
            return;
        }
        Log.d("DocumentServiceService", "Response notification is null, can't send it");
    }


    private void onServiceStart() {
        isServiceRunning.set(true);
    }

    private void onServiceEnd() {
        stopForeground(true);
        stopSelf();
        isServiceRunning.set(false);
    }


    private void deletePictures(ArrayList<String> picturesToDelete) {
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

    private void copyPictures(ArrayList<String> picturesToCopy) {
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

    private void movePictures(ArrayList<String> picturesToMove) {
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

    private void exportDocument(ArrayList<String> picturesToExport, String databasePath, String zipTo, String destinyPath) {
        Log.d("DocumentServiceService", "onStart exportDocument");

        try {
            // Create zip parameter
            ZipParameters parameters = new ZipParameters();
            parameters.setCompressionMethod(CompressionMethod.DEFLATE);
            parameters.setCompressionLevel(CompressionLevel.NORMAL);

            // Create zip file
            File fileZipTo = new File(zipTo);
            net.lingala.zip4j.ZipFile zipFile = new net.lingala.zip4j.ZipFile(fileZipTo);

            // Create amount of files variables for notifications
            int totalPicturesToExportFiles = picturesToExport.size();
            int totalFiles = totalPicturesToExportFiles + 2;
            int currentFile = 0;

            // Add each picture file to zip file
            for (int i = 0; i < totalPicturesToExportFiles; i++) {
                currentFile = i;

                File file = new File(picturesToExport.get(currentFile));
                Log.d("DocumentServiceService", String.format("Zipping (to export) file %d/%d. File name '%s'", currentFile + 1, totalPicturesToExportFiles, picturesToExport.get(currentFile)));

                if (!file.exists()) {
                    Log.d("DocumentServiceService", String.format("File %d/%d doesn't exists, skipping (to export)", currentFile + 1, totalPicturesToExportFiles));
                    continue;
                }

                if (file.isDirectory()) {
                    zipFile.addFolder(file, parameters);
                } else {
                    zipFile.addFile(file, parameters);
                }

                Log.d("DocumentServiceService", String.format("File %d/%d zipped (to export)", currentFile + 1, totalPicturesToExportFiles));
                updateNotificationProgress(currentFile + 1, totalFiles);
            }

            // Add database file to zip file
            Log.d("DocumentServiceService", String.format("Zipping database file (to export), path: %s", databasePath));
            zipFile.addFile(databasePath);
            currentFile += 1;
            updateNotificationProgress(currentFile + 1, totalFiles);
            Log.d("DocumentServiceService", String.format("Zipped database file (to export), path: %s", databasePath));

            // Copy (to move) zip file to its destiny path
            Log.d("DocumentServiceService", String.format("Copying (to move) zip file of exported document to its destiny path. From: '%s', to: '%s'", zipTo, destinyPath));
            FileInputStream fileInputStream = new FileInputStream(fileZipTo);
            FileOutputStream fileOutputStream = new FileOutputStream(destinyPath);
            fileInputStream.getChannel().transferTo(0, fileZipTo.length(), fileOutputStream.getChannel());
            fileInputStream.close();
            fileOutputStream.close();
            Log.d("DocumentServiceService", "Copied (to move) zip file of exported document");

            // Delete original zip file (to move)
            boolean isSourceFileDeleted = fileZipTo.delete();
            Log.d("DocumentServiceService", String.format("Check deletion of zip source file of exported document in moving process to destiny path. Was file deleted: %b", isSourceFileDeleted));

            // Delete export database
            File exportDatabase = new File(databasePath);
            boolean isExportDatabaseDeleted = exportDatabase.delete();
            Log.d("DocumentServiceService", String.format("Check export database file deletion. Was file deleted: %b", isExportDatabaseDeleted));

            updateNotificationProgress(1, 1);

            createResponseNotification("DocScan", "Documento exportado com sucesso");
            sendResponseNotification();
        } catch (Exception e) {
            Log.w("DocumentServiceService", String.format("exportDocument: Exception thrown. Error ignored. '%s'", e.getMessage()));
            e.printStackTrace();

            createResponseNotification("DocScan", "Falha na exportação do documento");
            sendResponseNotification();
        }

        Log.d("DocumentServiceService", "onEnd exportDocument");
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
            case ACTION_EXPORT:
                serviceQueue.add(new Runnable() {
                    @Override
                    public void run() {
                        String databasePath = intent.getStringExtra(EXTRA_DATABASE_PATH);
                        String pathZipTo = intent.getStringExtra(EXTRA_PATH_ZIP_TO);
                        String pathExportedDocument = intent.getStringExtra(EXTRA_PATH_EXPORTED_DOCUMENT);
                        String serviceNotificationTitle = intent.getStringExtra(EXTRA_NOTIFICATION_TITLE);

                        updateNotificationTitle(serviceNotificationTitle);
                        exportDocument(picturesArray, databasePath, pathZipTo, pathExportedDocument);
                    }
                });
                Log.i("DocumentServiceService", "Added exportDocument service operation to the queue");
                break;
        }

        if (isServiceRunning.get()) {
            Log.i("DocumentServiceService", "Service already running. Waiting it finish to start the next in queue");
            return START_STICKY;
        }

        notificationManagerCompat = NotificationManagerCompat.from(getApplicationContext());
        createNotification();
        startForeground(NOTIFICATION_ID_SERVICE, notificationServiceBuilder.build());

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
