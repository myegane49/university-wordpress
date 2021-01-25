wp.blocks.registerBlockType('brad/border-box', {
  title: 'My cool border box',
  icon: 'smiley',
  category: 'common',
  attributes: {
    content: {
      type: 'string',
      source: 'meta',
      meta: 'content'
    },
    color: {type: 'string'}
  },
  edit: function(props) {
    function updateContent(event) {
      props.setAttributes({content: event.target.value})
    }

    function updateColor(value) {
      props.setAttributes({color: value.hex})
    }

    return React.createElement("div", null, /*#__PURE__*/React.createElement("h3", null, "Your cool border box"), /*#__PURE__*/React.createElement("input", {
      type: "text",
      onChange: updateContent,
      value: props.attributes.content
    }), /*#__PURE__*/React.createElement(wp.components.ColorPicker, {
      onChangeComplete: updateColor,
      color: props.attributes.color
    }));
  },
  save: function(props) {
    // return React.createElement("h3", {
    //   style: {
    //     border: `5px solid ${props.attributes.color}`
    //   }
    // }, props.attributes.content);

    return null
  }
})