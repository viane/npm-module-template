import app from 'index';

describe('app', () => {
  it('returns string', () => {
    expect(typeof(app())).to.equal('string');
  });
});
