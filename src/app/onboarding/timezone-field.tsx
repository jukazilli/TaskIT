"use client";

import { useState } from "react";

import styles from "./onboarding.module.css";

type TimezoneFieldProps = Readonly<{
  initialTimezone: string;
}>;

export function TimezoneField({ initialTimezone }: TimezoneFieldProps) {
  const [timezone, setTimezone] = useState(initialTimezone);

  function useDeviceTimezone() {
    const detected = Intl.DateTimeFormat().resolvedOptions().timeZone;

    if (detected) {
      setTimezone(detected);
    }
  }

  return (
    <label className={styles.field} htmlFor="timezone">
      <span>Fuso horário</span>
      <input
        autoComplete="off"
        id="timezone"
        name="timezone"
        onChange={(event) => setTimezone(event.target.value)}
        required
        spellCheck={false}
        value={timezone}
      />
      <small>Usamos um identificador IANA, como America/Sao_Paulo.</small>
      {initialTimezone === "UTC" ? (
        <button
          className={styles.detectTimezone}
          onClick={useDeviceTimezone}
          type="button"
        >
          Usar fuso deste dispositivo
        </button>
      ) : null}
    </label>
  );
}
