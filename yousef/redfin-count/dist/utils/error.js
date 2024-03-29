"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processError = void 0;
const processError = (from, error, log) => {
    let message = `Caught from ${from} - `;
    if (error.response) {
        message = `${message} Error code ${error.response.status}: `;
        if (error.response.status === 404) {
            message = `${message} This was a bad request`;
        }
        if (error.response.status === 403) {
            console.log({ error });
            message = `${message} Failed CAPTCHA: Press & Hold to confirm you are a human (and not a bot)`;
        }
    }
    else if (error.request) {
        message = `${message} There was an error communicating with the server.  Please try again later.`;
    }
    else {
        // console.log({ error })
        message = `${message}${error.message}`;
    }
    log.error(message);
};
exports.processError = processError;
//# sourceMappingURL=error.js.map