import { fixture, html } from '@open-wc/testing';
import { visualDiff } from '@web/test-runner-visual-regression';

import '@material/mwc-button';

import './multi-page-dialog.js';
import type { MultiPageDialog } from './multi-page-dialog.js';

const factor = process.env.CI ? 2 : 1;

function timeout(ms: number) {
  return new Promise(res => {
    setTimeout(res, ms * factor);
  });
}

mocha.timeout(2000 * factor);

describe('Customized multi page dialog', () => {
  describe('as a single page dialog', () => {
    let dialogPage: MultiPageDialog;

    beforeEach(async () => {
      dialogPage = await fixture(
        html`<multi-page-dialog open heading="Heading"
          >Content</multi-page-dialog
        >`
      );
      await dialogPage.updateComplete;
      const div = document.createElement('div');
      div.style.width = '100%';
      div.style.height = '100%';

      document.body.prepend(div);
      document.body.prepend(dialogPage);
    });

    afterEach(() => dialogPage.remove());

    it('looks like the latest screenshot', async () => {
      await timeout(300);
      await visualDiff(document.body, `multi-page-dialog-single-default`);
    });
  });

  describe('as a single page dialog with primary action', () => {
    let dialogPage: MultiPageDialog;

    beforeEach(async () => {
      dialogPage = await fixture(
        html`<multi-page-dialog open heading="Heading"
          >Content<mwc-button
            slot="primaryAction"
            label="prim"
            icon="edit"
            trailingIcon
          ></mwc-button
        ></multi-page-dialog>`
      );
      await dialogPage.updateComplete;

      document.body.prepend(dialogPage);
    });

    afterEach(() => dialogPage.remove());

    it('looks like the latest screenshot', async () => {
      await timeout(300);
      await visualDiff(document.body, `multi-page-dialog-single-primary`);
    });

    it('with stacked option looks like the latest screenshot', async () => {
      dialogPage.stacked = true;
      await timeout(300);

      await visualDiff(document.body, `multi-page-dialog-stacked`);
    });
  });

  describe('as a multiple paged dialog', () => {
    let dialogPage1: MultiPageDialog;
    let dialogPage2: MultiPageDialog;
    let dialogPage3: MultiPageDialog;

    beforeEach(async () => {
      dialogPage1 = await fixture(
        html`<multi-page-dialog heading="Heading1"
          >Content Page 1</multi-page-dialog
        >`
      );
      dialogPage2 = await fixture(html`<multi-page-dialog heading="Heading2"
        >Content Page 2</multi-page-dialog
      >`);
      dialogPage3 = await fixture(html`<multi-page-dialog heading="Heading3"
        >Content Page 3
        <mwc-button
          slot="primaryAction"
          label="prim"
          icon="edit"
          trailingIcon
        ></mwc-button>
      </multi-page-dialog>`);

      document.body.prepend(dialogPage3);
      document.body.prepend(dialogPage2);
      document.body.prepend(dialogPage1);
    });

    afterEach(() => {
      dialogPage1.remove();
      dialogPage2.remove();
      dialogPage3.remove();
    });

    describe('with next dialog sibling', () => {
      beforeEach(async () => {
        dialogPage1.open = true;

        await dialogPage1.updateComplete;
      });

      it('looks like the latest screenshot', async () => {
        await timeout(300);
        await visualDiff(
          document.body,
          `multi-page-dialog-multi-w-next-sibling`
        );
      });
    });

    describe('with next and prev dialog sibling', () => {
      beforeEach(async () => {
        dialogPage2.open = true;

        await dialogPage2.updateComplete;
      });

      it('looks like the latest screenshot', async () => {
        await timeout(300);
        await visualDiff(
          document.body,
          `multi-page-dialog-multi-w-next-and-prev-sibling`
        );
      });
    });

    describe('with prev dialog sibling', () => {
      beforeEach(async () => {
        dialogPage3.open = true;

        await dialogPage3.updateComplete;
      });

      it('looks like the latest screenshot', async () => {
        await timeout(300);
        await visualDiff(
          document.body,
          `multi-page-dialog-multi-w-prev-sibling`
        );
      });
    });
  });

  describe('with non-default secondary or primary action slots', () => {
    let dialogPage1: MultiPageDialog;
    let dialogPage2: MultiPageDialog;
    let dialogPage3: MultiPageDialog;

    beforeEach(async () => {
      dialogPage1 = await fixture(
        html`<multi-page-dialog heading="Heading1">
          Content Page 1
          <mwc-button
            slot="secondaryAction"
            label="secButton1"
            icon="edit"
          ></mwc-button
          ><mwc-button slot="secondaryAction" label="secButton2"></mwc-button
          ><mwc-button
            slot="secondaryAction"
            label="secButton3"
            icon="add"
            trailingIcon
          ></mwc-button
        ></multi-page-dialog>`
      );
      dialogPage2 = await fixture(html`<multi-page-dialog heading="Heading2"
        >Content Page 2</multi-page-dialog
      >`);
      dialogPage3 = await fixture(html`<multi-page-dialog heading="Heading3">
        Content Page 3
        <mwc-button
          slot="primaryAction"
          label="primButton1"
          icon="edit"
        ></mwc-button
        ><mwc-button slot="primaryAction" label="primButton2"></mwc-button
        ><mwc-button
          slot="primaryAction"
          label="primButton3"
          icon="add"
          trailingIcon
        ></mwc-button>
      </multi-page-dialog>`);

      document.body.prepend(dialogPage3);
      document.body.prepend(dialogPage2);
      document.body.prepend(dialogPage1);
    });

    afterEach(() => {
      dialogPage1.remove();
      dialogPage2.remove();
      dialogPage3.remove();
    });

    it('overload default secondary action', async () => {
      dialogPage1.open = true;

      await timeout(300);
      await visualDiff(
        document.body,
        `multi-page-dialog-overload-secondaryAction`
      );
    });

    it('overload default primary action', async () => {
      dialogPage3.open = true;

      await timeout(300);
      await visualDiff(
        document.body,
        `multi-page-dialog-overload-primaryAction`
      );
    });
  });
});
