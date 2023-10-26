import { Actor } from 'apify'

import { getValidKey } from './general'

export const getStorageName = (namePrefix = 'MY_ACTOR') => {
    const { actorRunId, startedAt } = Actor.getEnv()
    const startDate = new Date(startedAt || Date.now())
        .toISOString()
        // .replace('T', '--')
        .replace('Z', '')
        .replace(/:/g, '-')
        .replace('.', '-')
    // .replace(/\.\d+/g, '');
    return getValidKey(`${namePrefix}${actorRunId ? `--${actorRunId}` : ''}--${startDate}`)
}
/*
/!**
 *
 * @typedef SaveDataCrawlerOptions
 * @property {string} namePrefix
 * @property {object} input
 * @property {function} requestHandler
 *!/

export class SaveDataCrawler {
    /!**
     *
     * @param {SaveDataCrawlerOptions} options
     *!/
    constructor(options) {
        const {
            namePrefix = 'ACTOR',
            input,
            requestHandler,
        } = options;
        this.namePrefix = namePrefix;
        this.input = input;
        this.requestHandler = requestHandler;
    }

    async init() {
        if (!this.saveDataRequestQueue) {
            const rqName = exports.getStorageName(this.namePrefix);
            this.saveDataRequestQueue = await Actor.openRequestQueue(rqName);
        }
    }

    async run() {
        log.info('Save data crawler started.');
        const {
            maxConcurrency = 3,
            monitorPerformance = true,
        } = this.input;
        const saveDataCrawler = new BasicCrawler({
            maxConcurrency,
            requestQueue: this.saveDataRequestQueue,
            handleRequestTimeoutSecs: 20,
            requestHandler: this.requestHandler,
            failedRequestHandler,
        });
        let performanceMonitor;
        if (monitorPerformance) {
            performanceMonitor = await createPerformanceMonitor({crawler: saveDataCrawler});
        }
        await saveDataCrawler.run();
        log.info('Save data crawler finished.');
        if (monitorPerformance) {
            await performanceMonitor.stop();
        }
    }
};

/!**
 * Create an instance of GlobalContext and initialize it.
 * @param {SaveDataCrawlerOptions} options
 * @returns {SaveDataCrawler}
 *!/
export const createSaveDataCrawler = async (options) => {
    const saveDataCrawler = new exports.SaveDataCrawler(options);
    await saveDataCrawler.init();
    return saveDataCrawler;
}; */
