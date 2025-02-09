from flask import Flask, render_template, request, jsonify
import requests

app = Flask(__name__)

# University API Endpoint
UNIVERSITY_API_URL = "http://software.diu.edu.bd:8006/result"

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/get_result", methods=["POST"])
def get_result():
    student_id = request.form.get("studentId")
    semester_id = request.form.get("semesterId")

    # Query parameters for the API
    params = {
        "grecaptcha": "",
        "semesterId": semester_id,
        "studentId": student_id
    }

    try:
        # Request the results from the university API
        response = requests.get(UNIVERSITY_API_URL, params=params)

        # Check response status
        if response.status_code == 200:
            result_data = response.json()  # Parse JSON response
            if result_data:
                return jsonify({"success": True, "data": result_data})
            else:
                return jsonify({"success": False, "message": "No results found for the provided criteria."})
        else:
            return jsonify({"success": False, "message": "Failed to fetch results from the server."})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)})

if __name__ == "__main__":
    app.run(debug=True)
