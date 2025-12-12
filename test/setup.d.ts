import { SinonStatic } from 'sinon';
import * as chai from 'chai';

declare global {
  namespace NodeJS {
    interface Global {
      assetsPath: (filename: string) => string;
      readAsset: (filename: string) => Promise<string>;
      expect: typeof chai.expect;
      assert: typeof chai.assert;
      sinon: SinonStatic;
    }
  }

  var assetsPath: (filename: string) => string;
  var readAsset: (filename: string) => Promise<string>;
  var expect: typeof chai.expect;
  var assert: typeof chai.assert;
  var sinon: SinonStatic;
}

export {};
