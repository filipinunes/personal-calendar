import { StatusPipe } from './status-pipe';

describe('StatusPipe', () => {
  let pipe: StatusPipe;

  beforeEach(() => {
    pipe = new StatusPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  describe('transform', () => {
    it('should transform PENDING to Pendente', () => {
      expect(pipe.transform('PENDING')).toBe('Pendente');
    });

    it('should transform IN_PROGRESS to Em andamento', () => {
      expect(pipe.transform('IN_PROGRESS')).toBe('Em andamento');
    });

    it('should transform DONE to Concluída', () => {
      expect(pipe.transform('DONE')).toBe('Concluída');
    });

    it('should return "-" for null value', () => {
      expect(pipe.transform(null)).toBe('-');
    });

    it('should return "-" for undefined value', () => {
      expect(pipe.transform(undefined)).toBe('-');
    });

    it('should return "-" for empty string', () => {
      expect(pipe.transform('')).toBe('-');
    });

    it('should return the original value for unknown status', () => {
      expect(pipe.transform('UNKNOWN_STATUS')).toBe('UNKNOWN_STATUS');
    });

    it('should return the original value for any other string', () => {
      expect(pipe.transform('some random text')).toBe('some random text');
    });

    it('should handle non-string values', () => {
      expect(pipe.transform(123)).toBe(123);
      expect(pipe.transform(true)).toBe(true);
      expect(pipe.transform({})).toEqual({});
    });
  });
});
