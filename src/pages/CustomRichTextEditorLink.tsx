import classNames from 'classnames';
import React, { useEffect, useState } from 'react';

/**
 * Source: https://github.com/jpuri/react-draft-wysiwyg/blob/master/src/components/Option/index.js#L8
 */
function Option({
  onClick,
  children,
  value,
  className,
  activeClassName = '',
  active = false,
  disabled = false,
  title,
}) {
  return (
    <div
      className={classNames('rdw-option-wrapper', className, {
        [`rdw-option-active ${activeClassName}`]: active,
        'rdw-option-disabled': disabled,
      })}
      onClick={() => {
        if (!disabled) {
          onClick(value);
        }
      }}
      aria-selected={active}
      title={title}
    >
      {children}
    </div>
  );
}

/**
 * Source: https://github.com/jpuri/react-draft-wysiwyg/blob/master/src/controls/Link/Component/index.js#L203
 */

function CustomRichTextEditorLink({
  config,
  currentState,
  doCollapse,
  expanded,
  onChange,
  onExpandEvent,
  translations,
}: CustomRichTextEditorLinkProps) {
  const [showModal, setShowModal] = useState(false);
  const [linkTarget, setLinkTarget] = useState('');
  const [linkTitle, setLinkTitle] = useState('');
  const [linkTargetOption, setLinkTargetOption] = useState(
    config.defaultTargetOption,
  );

  useEffect(() => {
    if (expanded && !expanded) {
      setShowModal(false);
      setLinkTarget('');
      setLinkTitle('');
      setLinkTargetOption(config.defaultTargetOption);
    }
  }, [expanded]);

  const updateValue = (event) => {
    const { name, value } = event.target;
    if (name === 'linkTarget') {
      setLinkTarget(value);
    } else if (name === 'linkTitle') {
      setLinkTitle(value);
    }
  };

  const signalExpandShowModal = () => {
    onExpandEvent();
    setShowModal(true);
    setLinkTarget(currentState.link?.target || '');
    setLinkTargetOption(currentState.link?.targetOption || linkTargetOption);
    setLinkTitle(currentState.link?.title || currentState.selectionText);
  };

  return (
    <div
      className={classNames('rdw-link-wrapper', config.className)}
      aria-label="rdw-link-control"
    >
      <Option
        value="unordered-list-item"
        className={classNames(config.link.className)}
        onClick={signalExpandShowModal}
        aria-haspopup="true"
        aria-expanded={showModal}
        title={
          config.link.title || translations['components.controls.link.link']
        }
      >
        <img src={config.link.icon} alt="" />
      </Option>
      <Option
        disabled={!currentState.link}
        value="ordered-list-item"
        className={classNames(config.unlink.className)}
        onClick={() => onChange('unlink')}
        title={
          config.unlink.title || translations['components.controls.link.unlink']
        }
      >
        <img src={config.unlink.icon} alt="" />
      </Option>
      {expanded && showModal && (
        <div
          className={classNames('rdw-link-modal', config.popupClassName)}
          onClick={(event) => event.stopPropagation()}
        >
          <label className="rdw-link-modal-label" htmlFor="linkTitle">
            {translations['components.controls.link.linkTitle']}
          </label>
          <input
            id="linkTitle"
            className="rdw-link-modal-input"
            onChange={updateValue}
            onBlur={updateValue}
            name="linkTitle"
            value={linkTitle}
          />
          <label className="rdw-link-modal-label" htmlFor="linkTarget">
            {translations['components.controls.link.linkTarget']}
          </label>
          <input
            id="linkTarget"
            className="rdw-link-modal-input"
            onChange={updateValue}
            onBlur={updateValue}
            name="linkTarget"
            value={linkTarget}
          />
          <span className="rdw-link-modal-buttonsection">
            <button
              className="rdw-link-modal-btn"
              onClick={() =>
                onChange('link', linkTitle, linkTarget, linkTargetOption)
              }
              disabled={!linkTarget || !linkTitle}
            >
              {translations['generic.add']}
            </button>
            <button className="rdw-link-modal-btn" onClick={doCollapse}>
              {translations['generic.cancel']}
            </button>
          </span>
        </div>
      )}
    </div>
  );
}

type CustomRichTextEditorLinkProps = {
  expanded?: boolean;
  doExpand?: () => void;
  doCollapse?: () => void;
  onExpandEvent?: () => void;
  config?: {
    link: any;
    unlink: any;
    popupClassName: string;
    defaultTargetOption?: string;
    className?: string;
  };
  onChange?: Function;
  currentState?: { link: any; selectionText: string };
  translations?: object;
};

export { CustomRichTextEditorLink };
