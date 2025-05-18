import { main } from '../src/index';

describe('main', () => {
  it('should return Hello World', () => {
    expect(main()).toBe('Hello World');
  });
}); 