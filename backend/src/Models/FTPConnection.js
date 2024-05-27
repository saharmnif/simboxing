const FtpClient = require('ftp-client');

class FTPConnection {
    constructor(host, port, user, password) {
        this.host = host;
        this.port = port;
        this.user = user;
        this.password = password;
        this.ftpClient = new FtpClient();
    }
        connect() {
            const config = {
                host: this.host,
                port: this.port,
                user: this.user,
                password: this.password
            };
    
            return new Promise((resolve, reject) => {
                console.log('Connecting to FTP server...');
                this.ftpClient.connect(config, (error, serverMessage) => {
                    if (error) {
                        console.error('Error connecting to FTP server:', error);
                        reject(error); // Rejeter la promesse en cas d'erreur de connexion
                    } else {
                        console.log('Connected to FTP server:', serverMessage);
                        resolve(serverMessage); // Résoudre la promesse si la connexion réussit
                    }
                });
    
                this.ftpClient.on('error', (error) => {
                    console.error('FTP client error:', error);
                    reject(error); // Rejeter la promesse en cas d'erreur
                });
            });
        }
    

    download(remotePath, localPath) {
        return new Promise((resolve, reject) => {
            this.ftpClient.download(remotePath, localPath, (error) => {
                if (error) {
                    console.error('Error downloading files:', error);
                    reject(error);
                } else {
                    console.log('Files downloaded successfully');
                    resolve();
                }
            });
        });
    }

    disconnect() {
        return new Promise((resolve, reject) => {
            this.ftpClient.disconnect(() => {
                console.log('Disconnected from FTP server');
                resolve();
            });
        });
    }
}

module.exports = FTPConnection;
