import { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { varAlpha, mergeClasses } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { Image } from '../image';
import { Iconify } from '../iconify';
import { uploadClasses } from './classes';
import { RejectionFiles } from './components/rejection-files';

import type { UploadProps } from './types';

export function UploadLogo({
    sx,
    error,
    value,
    disabled,
    helperText,
    className,
    ...other
}: UploadProps) {
    const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
        multiple: false,
        disabled,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.svg']
        },
        maxSize: 5242880, // 5MB max
        ...other,
    });

    const hasFile = !!value;
    const hasError = isDragReject || !!error;
    const [preview, setPreview] = useState('');

    useEffect(() => {
        if (typeof value === 'string') {
            setPreview(value);
        } else if (value instanceof File) {
            setPreview(URL.createObjectURL(value));
        }
        return () => {
            if (value instanceof File) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [value]);

    const renderPreview = () =>
        hasFile && (
            <Image
                alt="Logo"
                src={preview}
                sx={{
                    width: 1,
                    height: 1,
                    borderRadius: '50%',
                }}
            />
        );

    const renderPlaceholder = () => (
        <Box
            className="upload-placeholder"
            sx={(theme) => ({
                top: 0,
                gap: 1,
                left: 0,
                width: 1,
                height: 1,
                zIndex: 9,
                display: 'flex',
                borderRadius: 1,
                position: 'absolute',
                alignItems: 'center',
                color: 'text.disabled',
                flexDirection: 'column',
                justifyContent: 'center',
                bgcolor: varAlpha(theme.vars.palette.grey['500Channel'], 0.08),
                transition: theme.transitions.create(['opacity'], {
                    duration: theme.transitions.duration.shorter,
                }),
                '&:hover': { opacity: 0.72 },
                ...(hasError && {
                    color: 'error.main',
                    bgcolor: varAlpha(theme.vars.palette.error.mainChannel, 0.08),
                }),
                ...(hasFile && {
                    zIndex: 9,
                    opacity: 0,
                    color: 'common.white',
                    bgcolor: varAlpha(theme.vars.palette.grey['900Channel'], 0.64),
                }),
            })}
        >
            <Iconify icon="solar:upload-minimalistic-bold" width={32} />
            <Typography variant="caption">
                {hasFile ? 'Modifier le logo' : 'Télécharger un logo'}
            </Typography>
        </Box>
    );

    const renderContent = () => (
        <Box
            sx={{
                width: 1,
                height: 1,
                overflow: 'hidden',
                borderRadius: '50%',
                position: 'relative',
            }}
        >
            {renderPreview()}
            {renderPlaceholder()}
        </Box>
    );

    return (
        <>
            <Box
                {...getRootProps()}
                className={mergeClasses([uploadClasses.uploadBox, className])}
                sx={[
                    (theme) => ({
                        p: 1,
                        m: 'auto',
                        width: 144,
                        height: 144,
                        cursor: 'pointer',
                        overflow: 'hidden',
                        borderRadius: '50%',
                        border: `1px dashed ${varAlpha(theme.vars.palette.grey['500Channel'], 0.2)}`,
                        ...(isDragActive && { opacity: 0.72 }),
                        ...(disabled && { opacity: 0.48, pointerEvents: 'none' }),
                        ...(hasError && { borderColor: 'error.main' }),
                        ...(hasFile && {
                            ...(hasError && { bgcolor: varAlpha(theme.vars.palette.error.mainChannel, 0.08) }),
                            '&:hover .upload-placeholder': { opacity: 1 },
                        }),
                    }),
                    ...(Array.isArray(sx) ? sx : [sx]),
                ]}
            >
                <input {...getInputProps()} />

                {renderContent()}
            </Box>

            {helperText && helperText}

            {!!fileRejections.length && <RejectionFiles files={fileRejections} />}
        </>
    );
}