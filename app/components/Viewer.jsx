var React = require('react');
var {connect} = require('react-redux');
var actions = require('actions');
var EditableTextArea = require('EditableTextArea');

var Viewer = React.createClass({
  getInitialState: function() {
    return {
      viewer: undefined,
      mainImageLayer: undefined
    }
  },
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.selectedCanvasId !== nextProps.selectedCanvasId;
  },
  componentDidMount: function() {
    // save a single instance of the viewer to the state
    this.state.viewer = L.map('map', {
                          center: [0, 0],
                          crs: L.CRS.Simple,
                          zoom: 0,
                          touchZoom: false,
                          inertia: false,
                          attributionControl: false
                        });
    this.updateMainImageLayerInViewer();
  },
  componentDidUpdate: function() {
    // remove the main image layer from the viewer
    this.state.viewer.removeLayer(this.state.mainImageLayer);
    this.updateMainImageLayerInViewer();
  },
  saveMetadataFieldToStore: function(fieldValue, path) {
    this.props.dispatch(actions.updateMetadataFieldValueAtPath(fieldValue, path));
  },
  updateMainImageLayerInViewer: function() {
    if(this.props.selectedCanvasId !== undefined) {
      // create a new main image layer using the selected canvas
      var canvas = this.props.manifestoObject.getSequenceByIndex(0).getCanvasById(this.props.selectedCanvasId);
      if(canvas !== null) {
        var canvasImages = canvas.getImages();
        if(canvasImages.length > 0) {
          var serviceId = canvasImages[0].getResource().getServices()[0].id;
          var mainImageLayer = L.tileLayer.iiif(serviceId + '/info.json', {
            maxZoom: 6
          });

          // save the main image layer to the state
          this.setState({ mainImageLayer: mainImageLayer });

          // update the main image layer in the viewer
          mainImageLayer.addTo(this.state.viewer);
        }
      }
    }
  },
  render: function() {
    if(this.props.selectedCanvasId !== undefined) {
      var manifest = this.props.manifestoObject;
      var sequence = manifest.getSequenceByIndex(0);
      var canvas = this.props.manifestoObject.getSequenceByIndex(0).getCanvasById(this.props.selectedCanvasId);
      var canvasLabelPath = "sequences/0/canvases/" + sequence.getCanvasIndexById(canvas.id) + "/label";
      return (
        <div className="viewer-container">
          <div id="map" data-canvas-id={this.props.selectedCanvasId}></div>
          <EditableTextArea classNames="viewer-canvas-label" fieldValue={canvas !== null ? canvas.getLabel() : 'Empty canvas'} path={canvasLabelPath} onUpdateHandler={this.saveMetadataFieldToStore}/>
        </div>
      );
    } else {
      return (
        <div className="viewer-container">
          <div id="map" data-canvas-id={this.props.selectedCanvasId}></div>
          <div className="viewer-canvas-label">[This canvas has been deleted]</div>
        </div>
      );
    }
  }
});

module.exports = connect(
  (state) => {
    return {
      manifestoObject: state.manifestReducer.manifestoObject,
      selectedCanvasId: state.manifestReducer.selectedCanvasId
    };
  }
)(Viewer);
