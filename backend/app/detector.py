from ultralytics import YOLO

MODEL_PATH = "weights/best_dts.pt"
MIN_CONFIDENCE = 0.25

DAMAGE_TYPES = {
    "dent": "Вмятина",
    "scratch": "Царапина",
    "crack": "Трещина",
    "glass shatter": "Скол",
}

model = None


def get_model():
    global model
    if model is None:
        model = YOLO(MODEL_PATH)
    return model


def get_severity(width, height):
    area = width * height
    if area < 0.01:
        return "Лёгкая"
    if area < 0.05:
        return "Средняя"
    return "Сильная"


def find_damages(image_path):
    result = get_model().predict(image_path, conf=MIN_CONFIDENCE, verbose=False)[0]
    damages = []
    for box in result.boxes:
        name = result.names[int(box.cls)]
        if name not in DAMAGE_TYPES:
            continue
        x1, y1, x2, y2 = box.xyxyn[0].tolist()
        width = x2 - x1
        height = y2 - y1
        confidence = float(box.conf)
        damages.append(
            {
                "type": DAMAGE_TYPES[name],
                "severity": get_severity(width, height),
                "comment": f"Найдено моделью, уверенность {confidence:.0%}",
                "x": x1,
                "y": y1,
                "width": width,
                "height": height,
            }
        )
    return damages
