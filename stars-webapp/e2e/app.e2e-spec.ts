import { StarsWebappPage } from './app.po';

describe('stars-webapp App', () => {
  let page: StarsWebappPage;

  beforeEach(() => {
    page = new StarsWebappPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
