import { expect, fixture, html } from '@open-wc/testing';
import { spy } from 'sinon';

import './multi-page-dialog.js';
import type { MultiPageDialog } from './multi-page-dialog.js';

function timeout(ms: number) {
  return new Promise(res => {
    setTimeout(res, ms);
  });
}

describe('Customized multi page dialog', () => {
  describe('as a multiple paged dialog with default secondary and primary actions', () => {
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

    it('opens the next sibling dialog on default primary action click', async () => {
      dialogPage1.open = true;
      await timeout(100);

      dialogPage1.shadowRoot
        ?.querySelector<HTMLElement>('mwc-button[dialogAction="+1"]')
        ?.click();
      await timeout(100);

      expect(dialogPage1).to.not.have.attribute('open');
      expect(dialogPage2).to.have.attribute('open');
      expect(dialogPage3).to.not.have.attribute('open');
    });

    it('opens the prev sibling dialog on default secondary action click', async () => {
      dialogPage2.open = true;
      await timeout(100);

      dialogPage2.shadowRoot
        ?.querySelector<HTMLElement>('mwc-button[dialogAction="-1"]')
        ?.click();
      await timeout(100);

      expect(dialogPage1).to.have.attribute('open');
      expect(dialogPage2).to.not.have.attribute('open');
      expect(dialogPage3).to.not.have.attribute('open');
    });

    it('closes dialog on default secondary action close', async () => {
      dialogPage2.open = true;
      await timeout(100);

      dialogPage2.shadowRoot
        ?.querySelector<HTMLElement>('mwc-button[dialogAction="close"]')
        ?.click();
      await timeout(100);

      expect(dialogPage1).to.not.have.attribute('open');
      expect(dialogPage2).to.not.have.attribute('open');
      expect(dialogPage3).to.not.have.attribute('open');
    });
  });

  describe('with non-default secondary or primary action slots', () => {
    let dialogPage1: MultiPageDialog;
    let dialogPage2: MultiPageDialog;
    let dialogPage3: MultiPageDialog;
    let dialogPage4: MultiPageDialog;
    let dialogPage5: MultiPageDialog;

    const action = () => {};
    const primaryActionSpy = spy(action);
    const secondaryActionSpy = spy(action);

    beforeEach(async () => {
      dialogPage1 = await fixture(html`<multi-page-dialog heading="Heading1"
        >Content Page 1</multi-page-dialog
      >`);
      dialogPage2 = await fixture(html` <!-- @ts-ignore -->
        <multi-page-dialog heading="Heading2">
          Content Page 2
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
            @click=${secondaryActionSpy}
            trailingIcon
          ></mwc-button
        ></multi-page-dialog>`);
      dialogPage3 = await fixture(html`<multi-page-dialog heading="Heading3"
        >Content Page 3</multi-page-dialog
      >`);
      dialogPage4 = await fixture(html`<!-- @ts-ignore -->
        <multi-page-dialog heading="Heading4">
          Content Page 4
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
            @click=${primaryActionSpy}
            trailingIcon
          ></mwc-button>
        </multi-page-dialog> `);
      dialogPage5 = await fixture(html`<multi-page-dialog heading="Heading5"
        >Content Page 5</multi-page-dialog
      >`);

      document.body.prepend(dialogPage5);
      document.body.prepend(dialogPage4);
      document.body.prepend(dialogPage3);
      document.body.prepend(dialogPage2);
      document.body.prepend(dialogPage1);
    });

    afterEach(() => {
      dialogPage1.remove();
      dialogPage2.remove();
      dialogPage3.remove();
      dialogPage4.remove();
      dialogPage5.remove();
    });

    it('allows user-defined primary action callback', async () => {
      dialogPage4
        ?.querySelector<HTMLElement>(
          'mwc-button[slot="primaryAction"][icon="add"]'
        )
        ?.click();

      // eslint-disable-next-line no-unused-expressions
      expect(primaryActionSpy).to.have.been.calledOnce;
    });

    it('allows user-defined secondary action callback', async () => {
      dialogPage2
        ?.querySelector<HTMLElement>(
          'mwc-button[slot="secondaryAction"][icon="add"]'
        )
        ?.click();

      // eslint-disable-next-line no-unused-expressions
      expect(secondaryActionSpy).to.have.been.calledOnce;
    });

    it('allows user defined next', async () => {
      const customNext = dialogPage2.querySelector('mwc-button');
      customNext?.setAttribute('dialogAction', '+2');
      dialogPage2.open = true;
      await timeout(100);

      customNext?.click();
      await timeout(100);

      expect(dialogPage1).to.not.have.attribute('open');
      expect(dialogPage2).to.not.have.attribute('open');
      expect(dialogPage3).to.not.have.attribute('open');
      expect(dialogPage4).to.have.attribute('open');
      expect(dialogPage5).to.not.have.attribute('open');
    });

    it('overreaching next opens last page', async () => {
      const customNext = dialogPage2.querySelector('mwc-button');
      customNext?.setAttribute('dialogAction', '+100');
      dialogPage2.open = true;
      await timeout(100);

      customNext?.click();
      await timeout(100);

      expect(dialogPage1).to.not.have.attribute('open');
      expect(dialogPage2).to.not.have.attribute('open');
      expect(dialogPage3).to.not.have.attribute('open');
      expect(dialogPage4).to.not.have.attribute('open');
      expect(dialogPage5).to.have.attribute('open');
    });

    it('invalid next closes the page', async () => {
      const customNext = dialogPage2.querySelector('mwc-button');
      customNext?.setAttribute('dialogAction', 'invalid');
      dialogPage2.open = true;
      await timeout(100);

      customNext?.click();
      await timeout(100);

      expect(dialogPage1).to.not.have.attribute('open');
      expect(dialogPage2).to.not.have.attribute('open');
      expect(dialogPage3).to.not.have.attribute('open');
      expect(dialogPage4).to.not.have.attribute('open');
      expect(dialogPage5).to.not.have.attribute('open');
    });

    it('allows user defined previous', async () => {
      const customPrev = dialogPage4.querySelector('mwc-button');
      customPrev?.setAttribute('dialogAction', '-2');
      dialogPage4.open = true;
      await timeout(100);

      customPrev?.click();
      await timeout(100);

      expect(dialogPage1).to.not.have.attribute('open');
      expect(dialogPage2).to.have.attribute('open');
      expect(dialogPage3).to.not.have.attribute('open');
      expect(dialogPage4).to.not.have.attribute('open');
      expect(dialogPage5).to.not.have.attribute('open');
    });

    it('overreaching prev opens last page', async () => {
      const customPrev = dialogPage4.querySelector('mwc-button');
      customPrev?.setAttribute('dialogAction', '-100');
      dialogPage4.open = true;
      await timeout(100);

      customPrev?.click();
      await timeout(100);

      expect(dialogPage1).to.have.attribute('open');
      expect(dialogPage2).to.not.have.attribute('open');
      expect(dialogPage3).to.not.have.attribute('open');
      expect(dialogPage4).to.not.have.attribute('open');
      expect(dialogPage5).to.not.have.attribute('open');
    });

    it('closes dialog in dialog action', async () => {
      const customPrev = dialogPage4.querySelector('mwc-button');
      customPrev?.setAttribute('dialogAction', '0');
      dialogPage4.open = true;
      await timeout(100);

      customPrev?.click();
      await timeout(100);

      expect(dialogPage1).to.not.have.attribute('open');
      expect(dialogPage2).to.not.have.attribute('open');
      expect(dialogPage3).to.not.have.attribute('open');
      expect(dialogPage4).to.not.have.attribute('open');
      expect(dialogPage5).to.not.have.attribute('open');
    });
  });

  describe('with invalid inputs inside a dialog', () => {
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
          ><mwc-button
            slot="secondaryAction"
            label="secButton3"
            icon="add"
            trailingIcon
          ></mwc-button
        ></multi-page-dialog>`
      );
      dialogPage2 = await fixture(html`<multi-page-dialog heading="Heading2"
        ><input value="1234" pattern="[A-Z]*"
      /></multi-page-dialog>`);
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

    it('does not proceed next on invalid dialog', async () => {
      const customNext = dialogPage1.querySelector('mwc-button');
      customNext?.setAttribute('dialogAction', '+100');
      dialogPage1.open = true;
      await timeout(100);

      customNext?.click();
      await timeout(300);

      expect(dialogPage1).to.not.have.attribute('open');
      expect(dialogPage2).to.have.attribute('open');
      expect(dialogPage3).to.not.have.attribute('open');
    });

    it('does not proceed prev on invalid dialog', async () => {
      const customPrev = dialogPage3.querySelector('mwc-button');
      customPrev?.setAttribute('dialogAction', '-100');
      dialogPage3.open = true;
      await timeout(100);

      customPrev?.click();
      await timeout(300);

      expect(dialogPage3).to.not.have.attribute('open');
      expect(dialogPage2).to.have.attribute('open');
      expect(dialogPage1).to.not.have.attribute('open');
    });
  });
});
