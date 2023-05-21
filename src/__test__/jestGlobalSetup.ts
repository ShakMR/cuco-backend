export default () => {
  const mockDate = new Date('2020-01-01T00:00:00.000Z');
  jest.spyOn(global, 'Date').mockImplementation(() => mockDate);
};
