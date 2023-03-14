import { Button, ButtonVariants } from '@/ui/Button';
import { Paragraph } from '@/ui/Paragraph';
import { Text } from '@/ui/Text';
import { getGlobalBorderRadius } from '@/ui/theme';

function ButtonCard({ title, description, badge, ...props }) {
  return (
    <Button
      padding={4}
      borderRadius={getGlobalBorderRadius}
      variant={ButtonVariants.UNSTYLED}
      customChildren
      marginBottom={4}
      title={title}
      width="20rem"
      {...props}
      css={`
        flex-direction: column;
        align-items: flex-start;
        background-color: rgba(255, 255, 255, 1);
        box-shadow: ${({ theme }) => theme.components.button.boxShadow.small};

        &:hover {
          background-color: #e6e6e6;
        }
      `}
    >
      <Paragraph
        fontWeight="bold"
        display="flex"
        justifyContent="space-between"
        width="18rem"
        textAlign="left"
        minHeight="1.9rem"
      >
        <Text
          width="80%"
          css={`
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          `}
        >
          {title}
        </Text>
        {badge}
      </Paragraph>
      {description && (
        <Text
          textAlign="left"
          width="80%"
          css={`
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          `}
        >
          {description}
        </Text>
      )}
    </Button>
  );
}

export { ButtonCard };
