var React = require('react');
var { connect } = require('react-redux');
var EditableTextArea = require('EditableTextArea');
var DeleteMetadataPropertyButton = require('DeleteMetadataPropertyButton');

var EditablePrimitiveMetadataPropertyCard = React.createClass({
  getInitialState: function() {
    return {
      value: this.props.value
    }
  },

  componentWillReceiveProps: function(nextProps) {
    if(this.props.value !== nextProps.value) {
      this.setState({ value: nextProps.value });
    }
  },

  render: function() {
    return (
      <dl>
        <dt className="metadata-field-label">
          {(() => {
            if(this.props.isEditableLabel) {
              return (
                <EditableTextArea
                  fieldValue={this.props.label}
                  updateHandler={this.props.updateLabelHandler}
                />
              );
            } else {
              return (
                <div>
                  {this.props.label}
                </div>
              );
            }
          })()}
        </dt>

        <dd className="metadata-field-value">
          <EditableTextArea
            fieldName={this.props.name}
            fieldValue={this.state.value}
            updateHandler={this.props.updateValueHandler}
          />
        </dd>

        {(() => {
          if(!this.props.isRequired) {
            return (
              <DeleteMetadataPropertyButton
                deleteHandler={this.props.deleteHandler}
              />
            );
          }
        })()}
      </dl>
    );
  }
});

module.exports = connect()(EditablePrimitiveMetadataPropertyCard);