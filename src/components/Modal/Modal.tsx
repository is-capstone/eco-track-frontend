import * as React from 'react';
import UndoIcon from '@mui/icons-material/Undo';
import UploadIcon from '@mui/icons-material/Upload';

import s from './Modal.module.scss';
import cn from 'classnames';
import axios from 'axios';
import { keycloak } from '../../main';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClick?: () => void;
  children?: React.ReactNode;
  closeButton?: string;
  showUplaod?: boolean;
  classNames?: {
    modal?: string;
    wrapper?: string;
  };
  onLoad?: () => void;
  buttonText?: string;
  metricId?: number;
}

interface StartFastUploadResponseDto {
  uploadId: string;
  fileId: string;
}
interface PartDetailsDto {
  partNumber: number;
  eTag: string;
}
interface FinishFastUploadDto {
  uploadId: string;
  fileId: string;
  parts: PartDetailsDto[];
}

export const Modal = ({
  isOpen,
  onClose,
  children,
  onClick,
  showUplaod = true,
  classNames = {},
  buttonText = 'Добавить',
  onLoad,
  metricId,
}: ModalProps) => {
  React.useEffect(() => {
    if (onLoad) onLoad();
  }, []);

  if (!isOpen) return null;

  const uploadFile = async (
    metricsId: number,
    file: File,
    filename: string,
    chunks: number
  ) => {
    console.time('elapsed');
    const chunkSize: number = Math.ceil(file.size / chunks);
    console.log(chunkSize);

    const startRes: StartFastUploadResponseDto = await axios
      .get<StartFastUploadResponseDto>(
        `/api/file/upload/start?metricsId=${metricsId}&filename=${filename}`,
        {
          headers: {
            Authorization: 'Bearer ' + keycloak.token,
            'Content-Type': 'application/json',
          },
        }
      )
      .then((res) => res.data);
    let partUploadResults: Promise<PartDetailsDto>[] = [];

    for (let partNumber = 0; partNumber < chunks; partNumber++) {
      const start: number = partNumber * chunkSize;
      const end: number = Math.min(start + chunkSize, file.size);
      const chunk: Blob = file.slice(start, end);

      const formData: FormData = new FormData();
      formData.append('part', chunk);

      const res: Promise<PartDetailsDto> = axios
        .post<PartDetailsDto>(
          `/api/file/upload/part?uploadId=${startRes.uploadId}&partNumber=${
            partNumber + 1
          }&fileId=${startRes.fileId}`,
          formData,
          {
            headers: {
              Authorization: 'Bearer ' + keycloak.token,
              'Content-Type': 'multipart/form-data',
            },
          }
        )
        .then((res) => res.data);
      partUploadResults.push(res);
    }

    const results: PartDetailsDto[] = await Promise.all(partUploadResults);
    if (results.length != chunks) {
      console.error('Upload failed');
      return;
    }

    const finishReqBody: FinishFastUploadDto = {
      uploadId: startRes.uploadId,
      fileId: startRes.fileId,
      parts: results,
    };
    axios
      .post<void>('/api/file/upload/finish', finishReqBody, {
        headers: {
          Authorization: 'Bearer ' + keycloak.token,
          'Content-Type': 'application/json',
        },
      })
      .then((res) => console.log(res))
      .catch((err) => console.error(err));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let file = e.target.files?.item(0);

    console.log(metricId);
    if (file != null && metricId) {
      console.log(`File size: ${file.size}`);

      uploadFile(metricId, file, file.name, 30).then((res) => {
        console.log('Upload finished');
        console.timeEnd('elapsed');
      });
      return;
    }
  };

  return (
    <div className={s.overlay} onClick={onClose}>
      <div
        className={cn(s.modal, classNames.modal)}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={s.icons}>
          <UndoIcon
            onClick={onClose}
            className={s.arrow}
            sx={{ color: 'white' }}
          />
          {showUplaod && (
            <>
              <label htmlFor="file-upload">
                <UploadIcon sx={{ color: 'white' }} />
              </label>
              <input
                id="file-upload"
                style={{ display: 'none' }}
                type="file"
                accept=".json, .csv"
                onChange={handleChange}
              />
            </>
          )}
        </div>
        <div className={cn(s.wrapper, classNames.wrapper)}>
          {children}
          <button className={s.add} onClick={onClick}>
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};
