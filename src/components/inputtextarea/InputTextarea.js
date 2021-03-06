import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Tooltip from "../tooltip/Tooltip";

export class InputTextarea extends Component {

    static defaultProps = {
        autoResize: false,
        onInput: null,
        cols: 20,
        rows: 2,
        tooltip: null,
        tooltipOptions: null
    };

    static propTypes = {
        autoResize: PropTypes.bool,
        onInput: PropTypes.func,
        cols: PropTypes.number,
        rows: PropTypes.number,
        tooltip: PropTypes.string,
        tooltipOptions: PropTypes.object
    };
    
    constructor(props) {
        super(props);
        this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
        this.onInput = this.onInput.bind(this);
        this.state = {filled: false};

        this.textareaProps = Object.assign({}, this.props);
        delete this.textareaProps.autoResize;
        delete this.textareaProps.onInput;
        delete this.textareaProps.onBlur;
        delete this.textareaProps.onKeyUp;
        delete this.textareaProps.onInput;
        delete this.textareaProps.tooltip;
        delete this.textareaProps.tooltipOptions;
    }

    onFocus(e) {
        if (this.props.autoResize) {
            this.resize();
        }

        if (this.props.onFocus) {
            this.props.onFocus(e);
        }
    }

    onBlur(e) {
        if (this.props.autoResize) {
            this.resize();
        }

        if (this.props.onBlur) {
            this.props.onBlur(e);
        }
    }

    onKeyUp(e) {
        if (this.props.autoResize) {
            this.resize();
        }

        if (this.props.onKeyUp) {
            this.props.onKeyUp(e);
        }
    }

    onInput(e) {
        if (this.props.autoResize) {
            this.resize();
        }

        if (this.props.onInput) {
            this.props.onInput(e);
        }

        this.updateFilledState(e);
    }

    resize() {
        if (!this.cachedScrollHeight) {
            this.cachedScrollHeight = this.element.scrollHeight;
            this.element.style.overflow = "hidden";
        }

        if (this.cachedScrollHeight !== this.element.scrollHeight) {
            this.element.style.height = ''
            this.element.style.height = this.element.scrollHeight + 'px';

            if (parseFloat(this.element.style.height) >= parseFloat(this.element.style.maxHeight)) {
                this.element.style.overflowY = "scroll";
                this.element.style.height = this.element.style.maxHeight;
            }
            else {
                this.element.style.overflow = "hidden";
            }

            this.cachedScrollHeight = this.element.scrollHeight;
        }
    }

    updateFilledState(e) {
        let _filled = (e.target.value && e.target.value.length) ? true : false;
        this.setState({filled: _filled});
    }
    
    componentDidMount() {
        let _value =  this.textareaProps.value||this.textareaProps.defaultValue,
        _filled = (_value && _value.length) ? true : false;
        
        this.setState({filled: _filled});

        if (this.props.tooltip) {
            this.renderTooltip();
        }

        if (this.props.autoResize) {
            this.resize();
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.tooltip && prevProps.tooltip !== this.props.tooltip) {
            if (this.tooltip)
                this.tooltip.updateContent(this.props.tooltip);
            else
                this.renderTooltip();
        }

        if (this.props.autoResize) {
            this.resize();
        }
    }

    componentWillUnmount() {
        if (this.tooltip) {
            this.tooltip.destroy();
            this.tooltip = null;
        }
    }

    renderTooltip() {
        this.tooltip = new Tooltip({
            target: this.element,
            content: this.props.tooltip,
            options: this.props.tooltipOptions
        });
    }

    render() {
        if(this.props.hasOwnProperty('value')) {
            this.textareaProps.value = this.props.value;
        }

        var className = classNames('p-inputtext p-inputtextarea p-component', this.props.className, {
            'p-disabled': this.props.disabled,
            'p-state-filled': this.state.filled,
            'p-inputtextarea-resizable': this.props.autoResize
        });

        return (
            <textarea {...this.textareaProps} className={className} ref={input => this.element = input} 
                onFocus={this.onFocus} onBlur={this.onBlur} onKeyUp={this.onKeyUp} onInput={this.onInput}></textarea>
        );
    }
}