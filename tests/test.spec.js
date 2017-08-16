import NodeProject from 'index';
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
chai.use(require('chai-fs'));
const expect = chai.expect;
const assert = chai.assert;

const should = chai.should();
const foo = 'bar';

describe('Chai Test', () => {
  it('This should always pass', ()=> {
    foo.should.be.a('string');
    foo.should.equal('bar');
    foo.should.have.lengthOf(3);
  });
});

describe('Template Test', () => {
  it('This should always pass for original template', ()=> {
      NodeProject.alwaysTrue().should.equal('Good');
  });
});
