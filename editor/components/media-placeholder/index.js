/**
 * External dependencies
 */
import { get, noop } from 'lodash';
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import {
	Button,
	FormFileUpload,
	Placeholder,
	DropZone,
	withNotices,
} from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n';
import { Component, Fragment } from '@wordpress/element';

/**
 * Internal dependencies
 */
import './style.scss';
import MediaUpload from '../media-upload';
import editorMediaUpload from '../../utils/editor-media-upload';

class MediaPlaceholder extends Component {
	constructor() {
		super( ...arguments );
		this.state = {
			src: '',
		};
		this.onChangeSrc = this.onChangeSrc.bind( this );
		this.onSubmitSrc = this.onSubmitSrc.bind( this );
		this.onUpload = this.onUpload.bind( this );
		this.onFilesUpload = this.onFilesUpload.bind( this );
	}

	componentDidMount() {
		this.setState( { src: get( this.props.value, [ 'src' ], '' ) } );
	}

	componentDidUpdate( prevProps ) {
		if ( get( prevProps.value, [ 'src' ], '' ) !== get( this.props.value, [ 'src' ], '' ) ) {
			this.setState( { src: get( this.props.value, [ 'src' ], '' ) } );
		}
	}

	onChangeSrc( event ) {
		this.setState( {
			src: event.target.value,
		} );
	}

	onSubmitSrc( event ) {
		event.preventDefault();
		if ( this.state.src ) {
			this.props.onSelectUrl( this.state.src );
		}
	}

	onUpload( event ) {
		this.onFilesUpload( event.target.files );
	}

	onFilesUpload( files ) {
		/**
		 * We use a prop named `disable`, set to `false` by default, because it makes for a nicer
		 * component prop API. eg:
		 *
		 * <MediaPlaceholder disableMaxUploadErrorMessages />
		 * instead of:
		 * <MediaPlaceholder enableMaxUploadErrorMessages={ false } />
		 */
		const { onSelect, type, multiple, onError = noop, disableMaxUploadErrorMessages = false, noticeOperations } = this.props;
		const setMedia = multiple ? onSelect : ( [ media ] ) => onSelect( media );
		editorMediaUpload( {
			allowedType: type,
			filesList: files,
			onFileChange: setMedia,
			onError: ( errorMessage ) => {
				onError( errorMessage );
				if ( disableMaxUploadErrorMessages === false ) {
					noticeOperations.createErrorNotice( errorMessage );
				}
			},
		} );
	}

	render() {
		const {
			type,
			accept,
			icon,
			className,
			labels,
			onSelect,
			value = {},
			onSelectUrl,
			onHTMLDrop = noop,
			multiple = false,
			additionalNotices,
			noticeUI,
		} = this.props;

		return (
			<Placeholder
				icon={ icon }
				label={ labels.title }
				instructions={ sprintf( __( 'Drag %s, upload a new one or select a file from your library.' ), labels.name ) }
				className={ classnames( 'editor-media-placeholder', className ) }
				notices={ <Fragment>{ additionalNotices }{ noticeUI }</Fragment> }
			>
				<DropZone
					onFilesDrop={ this.onFilesUpload }
					onHTMLDrop={ onHTMLDrop }
				/>
				{ onSelectUrl && (
					<form onSubmit={ this.onSubmitSrc }>
						<input
							type="url"
							className="components-placeholder__input"
							placeholder={ __( 'Enter URL here…' ) }
							onChange={ this.onChangeSrc }
							value={ this.state.src } />
						<Button
							isLarge
							type="submit">
							{ __( 'Use URL' ) }
						</Button>
					</form>
				) }
				<FormFileUpload
					isLarge
					className="editor-media-placeholder__upload-button"
					onChange={ this.onUpload }
					accept={ accept }
					multiple={ multiple }
				>
					{ __( 'Upload' ) }
				</FormFileUpload>
				<MediaUpload
					gallery={ multiple }
					multiple={ multiple }
					onSelect={ onSelect }
					type={ type }
					value={ value.id }
					render={ ( { open } ) => (
						<Button isLarge onClick={ open }>
							{ __( 'Media Library' ) }
						</Button>
					) }
				/>
			</Placeholder>
		);
	}
}

export default withNotices( MediaPlaceholder );
