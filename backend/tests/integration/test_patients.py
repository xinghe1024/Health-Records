import pytest


from fastapi import FastAPI
from fastapi.testclient import TestClient

@pytest.mark.parametrize("invalid_name", ["", "   "])
def test_blank_patient_name_is_rejected(
    test_app: FastAPI,
    invalid_name: str,
):
    with TestClient(test_app) as client:
        response = client.post(
            "/api/patient",
            json={"name": invalid_name},
        )
        assert response.status_code == 422

        list_response = client.get("/api/patient")
        assert list_response.status_code == 200
        assert list_response.json() == []


def test_create_patient_and_get_it(test_app: FastAPI):
    with TestClient(test_app) as client:
        response = client.post("/api/patient", json = {"name":"     测试患者    "})
        assert response.status_code == 201

        created_patient = response.json()
        assert created_patient["name"] == "测试患者"

        patient_id = created_patient["id"]
        patient_response = client.get(f"/api/patient/{patient_id}")
        assert patient_response.status_code == 200
        assert patient_response.json() == created_patient


def test_update_patient_and_get_it(test_app: FastAPI):
    with TestClient(test_app) as client:
        response = client.post("/api/patient", json={"name": "测试患者"})
        assert response.status_code == 201

        created_patient = response.json()
        patient_id = created_patient["id"]
        update_response = client.put(
            f"/api/patient/{patient_id}",
            json = {"name" : "  修改后的患者   "},
        )
        assert update_response.status_code == 200

        updated_patient = update_response.json()
        assert updated_patient["id"] == patient_id
        assert updated_patient["name"] == "修改后的患者"

        patient_response = client.get(f"/api/patient/{patient_id}")
        assert patient_response.status_code == 200
        assert patient_response.json() == updated_patient


def test_delete_patient_and_get_it(test_app: FastAPI):
    with TestClient(test_app) as client:
        response = client.post("/api/patient", json={"name": "测试患者"})
        assert response.status_code == 201

        created_patient = response.json()
        patient_id = created_patient["id"]
        delete_response = client.delete(f"/api/patient/{patient_id}")
        assert delete_response.status_code == 204
        assert delete_response.content == b""

        patient_response = client.get(f"/api/patient/{patient_id}")
        assert patient_response.status_code == 404

        again_delete_response = client.delete(f"/api/patient/{patient_id}")
        assert again_delete_response.status_code == 404


def test_list_patients_with_pagination(test_app: FastAPI):
    with TestClient(test_app) as client:
        names = ["患者甲","患者乙","患者丙"]
        created_patients = []

        for name in names:
            response = client.post("/api/patient", json = {"name": name})
            assert response.status_code == 201

            created_patient = response.json()
            created_patients.append(created_patient)

        list_response = client.get(
            "/api/patient",
            params={"limit": 1, "offset": 1},
        )
        assert list_response.status_code == 200
        assert list_response.json() == [created_patients[1]]

        again_list_response = client.get(
            "/api/patient",
            params={"limit": 1, "offset": 3},
        )
        assert again_list_response.status_code == 200
        assert again_list_response.json() == []


@pytest.mark.parametrize(
    "query_params",
    [
        {"limit": 0},
        {"limit": 101},
        {"offset": -1},
    ],
)
def test_list_patients_rejects_invalid_pagination(
    test_app: FastAPI,
    query_params: dict[str, int],
):
    with TestClient(test_app) as client:
        response = client.get("/api/patient", params=query_params)
        assert response.status_code == 422


def test_update_missing_patient_does_not_create_it(test_app: FastAPI):
    with TestClient(test_app) as client:
        response = client.put(
            "/api/patient/1",
            json={"name": "修改后的患者"},
        )
        assert response.status_code == 404

        list_response = client.get("/api/patient")
        assert list_response.status_code == 200
        assert list_response.json() == []