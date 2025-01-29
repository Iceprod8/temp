import boto3


filename = "ABIBULA__Etape_0_de_10_Superieur.stl"

s3 = boto3.client("s3")
with open(f"./cypress/fixtures/{filename}", "wb") as f:
    s3.download_fileobj(
        "orthoin3d-data",
        "tests/jaw_meshes/originals/ABIBULA__Etape_0_de_10_Superieur.stl",
        f,
    )
