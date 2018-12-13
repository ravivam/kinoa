"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = {
    seleniumAddress: 'http://localhost:4444/wd/hub',
    //specs: ["../features/*.feature"],
    specs: ["D:\\DevopsPOC\\kinoa\\test\\features\\Home.feature"],
    framework: 'custom',
    frameworkPath: require.resolve('protractor-cucumber-framework'),
    baseUrl: "http://localhost:3000/#/",
    cucumberOpts: {
        complier: "ts:ts-node/register",
        strict: true,
        //format: ['pretty'],
        //require: ['../steps/*.js', '../hooks/*.js'],
        require: ['D:\\DevopsPOC\\kinoa\\test\\steps\\HomeSteps.js', '../hooks/*.js'],
        tags: '@smoke'
    }
};
