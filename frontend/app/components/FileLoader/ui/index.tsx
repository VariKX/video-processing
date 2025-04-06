'use client';

import React, { useState, useEffect, useMemo } from "react";
import s from "./style.module.scss";
import type { FileLoadersType } from "../type";
import axios from "axios";
import { formatFileSize } from "@/app/utils/format";

interface IProps {
  type: FileLoadersType;
}

interface UploadProgress {
  loaded: number;
  total: number;
  speed: number;
}

const FileLoader: React.FC<IProps> = ({ type }) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<UploadProgress | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const timeLeft = useMemo(() => {
    if (!progress || progress.speed === 0) return 'Вычисление...';
    
    const bytesLeft = progress.total - progress.loaded;
    const secondsLeft = Math.ceil(bytesLeft / progress.speed);
    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;
    
    if (minutes > 0) {
      return `${minutes} мин ${seconds} сек`;
    }
    return `${seconds} сек`;
  }, [progress]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFile = e.target.files?.[0];

    if (newFile) {
      if (!newFile.type.startsWith('video/')) {
        setError('Пожалуйста, выберите видео файл');
        setFile(null);
        return;
      }
    }

    setFile(newFile || null);
    setError(null);
    setProgress(null);
    setIsSuccess(false);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Пожалуйста, выберите видео файл');
      return;
    }
    
    const formData = new FormData();
    formData.append('video', file);
    
    try {
      const startTime = Date.now();
      const response = await axios.post(`http://localhost:4000/api/upload-video/${type.toLowerCase()}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent: any) => {
          const elapsedTime = (Date.now() - startTime) / 1000;
          const speed = progressEvent.loaded / elapsedTime;
          
          setProgress({
            loaded: progressEvent.loaded,
            total: progressEvent.total,
            speed
          });
        }
      });

      setIsSuccess(true);
      console.log(response);
    } catch (error) { 
      setError('Ошибка при загрузке видео');
    }
  }

  return (
    <div className={s["video-upload"]}>
      <h2 className={s["video-upload__caption"]}>
        {type === "SLOW" ? "Обычная загрузка" : "Быстрая загрузка"}
      </h2>
      <div className={s["video-upload__block-input"]}>
        <label className={s["video-upload__input-wrapper"]}>
          <input 
            type="file" 
            className={s["video-upload__input"]} 
            accept="video/*"
            onChange={handleFileChange}
          />
          <svg className={s["video-upload__input-icon"]} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className={s["video-upload__input-text"]}>
            {file ? file.name : 'Выберите видео файл'}
          </span>
          <span className={s["video-upload__input-hint"]}>
            или перетащите его сюда
          </span>
        </label>
        <div className={s["video-upload__progress-container"]}>
          <progress 
            value={progress ? (progress.loaded * 100) / progress.total : 0} 
            max={100} 
            className={s["video-upload__progress"]} 
          />
          {file && (
            <div className={s["video-upload__progress-info"]}>
              <div className={s["video-upload__progress-left"]}>
                <span>{formatFileSize(progress?.loaded || 0)}</span>
                <span className={s["video-upload__time-left"]}>{timeLeft}</span>
              </div>
              <span>{formatFileSize(file.size)}</span>
            </div>
          )}
        </div>
        {error && <p className={s["video-upload__error"]}>{error}</p>}
        {isSuccess && (
          <div className={s["video-upload__success"]}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Видео успешно загружено!
          </div>
        )}
      </div>
      <button 
        onClick={handleUpload} 
        disabled={!file || !!error || isSuccess} 
        className={s["video-upload__button"]}
      >
        {isSuccess ? 'Видео загружено' : 'Загрузить видео'}
      </button>
    </div>
  );
};

export default FileLoader;
