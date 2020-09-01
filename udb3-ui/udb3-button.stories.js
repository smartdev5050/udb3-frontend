import Udb3Button, { ButtonVariant } from './udb3-button.vue';

export default {
  title: 'udb3-button',
  component: Udb3Button,
  argTypes: {},
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { Udb3Button },
  template: '<udb3-button v-bind="$props">click me</udb3-button>',
});

export const Primary = Template.bind({});

export const Secondary = Template.bind({});
Secondary.args = {
  variant: ButtonVariant.SECONDARY,
};

export const Success = Template.bind({});
Success.args = {
  variant: ButtonVariant.SUCCESS,
};

export const Danger = Template.bind({});
Danger.args = {
  variant: ButtonVariant.DANGER,
};
