'use strict';

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');
require('./file.js');
// require('./job.js');
const File = mongoose.model('File');
// const Job = mongoose.model('Job');

const utils = require('../lib/utils.js');

const Schema = mongoose.Schema;

/**
 * User Schema
 */

const UserSchema = new Schema({
    email: {
        type: String,
        default: '',
        index: {
            unique: true
        }
    },
    password: {
        type: String,
        default: '',
        select: false
    },
    resetPasswordToken: {
        type: String,
        default: ''
    },
    resetPasswordExpires: {
        type: Date
    },
    diskQuota: {
        type: Number,
        default: 1000000
    },
    diskUsage: {
        type: Number,
        default: 0
    },
    sessions: [{
        id: String,
        date: Date
    }],
    attributes: {
        type: Schema.Types.Mixed,
        default: {}
    },
    home: {
        type: Schema.Types.ObjectId,
        ref: 'File'
    }

}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
});

UserSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

/**
 * Methods
 */

UserSchema.methods = {
    createHomeFolder: function () {
        var homeFolder = new File({
            name: this.email,
            user: this._id,
            path: this.email,
            type: 'FOLDER'
        });
        homeFolder.save();
        this.home = homeFolder;
        this.save();
        homeFolder.fsCreateFolder();
    },
    removeSessionId: function (sessionId, logoutOther) {
        if (logoutOther === true) {
            this.sessions = [];
        } else {
            var index = -1;
            for (var i = 0; i < this.sessions.length; i++) {
                var session = this.sessions[i];
                if (session.id === sessionId) {
                    index = i;
                    break;
                }
            }
            if (index >= 0) {
                this.sessions.splice(index, 1);
            }
        }
        this.save();
    },

    checkSessionId: function (sessionId) {

        for (var i = 0; i < this.sessions.length; i++) {
            var session = this.sessions[i];
            if (session.id === sessionId) {
                return true;
            }
        }
        return false;
    },
    // updateLastActivity: function() {
    //     this.lastActivity = Date.now();
    //     this.save();
    // },
    login: function () {

        var sessionId = utils.generateRandomString();
        var session = {
            id: sessionId,
            date: Date.now()
        };

        this.sessions.push(session);
        this.save();

        return session;

    }

};

/**
 * Statics
 */

UserSchema.statics = {};

mongoose.model('User', UserSchema);
