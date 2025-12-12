import * as path from 'path';
import { promises as fs } from 'fs';
import chai from 'chai';
import sinon from 'sinon';

global.assetsPath = (filename: string) => path.join(__dirname, 'assets', filename);
global.readAsset = async (filename: string) => fs.readFile(global.assetsPath(filename), 'utf-8');

chai.config.includeStack = true;

global.expect = chai.expect;
global.assert = chai.assert;
global.sinon = sinon;
