package com.mpdbd;

import com.server.TCPServer;

/**
 * Hello world!
 *
 */
public class App 
{
      public static void main(String[] args) {
        // Start TCP Server
        Thread tcpThread = new Thread(() -> TCPServer.startServer(3000));
        tcpThread.start();

        System.out.println("MPDB Daemon Started!");
    }
}
