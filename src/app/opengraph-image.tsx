import { ImageResponse } from "next/og";

export const alt = "TaskIT — Sua semana de estudos, com clareza";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "72px 82px",
          background: "#FAFCF8",
          color: "#172019",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", width: "62%" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              fontSize: "30px",
              fontWeight: 800,
            }}
          >
            <span
              style={{
                display: "flex",
                width: "18px",
                height: "48px",
                borderRadius: "999px",
                background: "#B9F227",
              }}
            />
            TaskIT
          </div>
          <div
            style={{
              marginTop: "54px",
              fontSize: "72px",
              lineHeight: 1.02,
              letterSpacing: "-3px",
              fontWeight: 800,
            }}
          >
            Sua semana de estudos, com clareza.
          </div>
          <div
            style={{
              marginTop: "30px",
              fontSize: "28px",
              lineHeight: 1.45,
              color: "#667067",
            }}
          >
            Tarefas, projetos e planejamento semanal em um lugar leve.
          </div>
        </div>
        <div
          style={{
            width: "300px",
            height: "390px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "60px",
            background: "#172019",
            boxShadow: "0 30px 80px rgba(23,32,25,.18)",
          }}
        >
          <div
            style={{
              width: "92px",
              height: "250px",
              display: "flex",
              borderRadius: "999px",
              background: "#B9F227",
            }}
          />
        </div>
      </div>
    ),
    size,
  );
}
