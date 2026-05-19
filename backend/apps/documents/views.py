from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from .models import Document
from .serializers import DocumentSerializer

from .services import (
    extract_text_from_pdf,
    extract_text_from_docx,
    extract_text_from_txt,
)


class DocumentUploadView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        documents = Document.objects.filter(user=request.user).order_by('-uploaded_at')
        serializer = DocumentSerializer(documents, many=True)
        return Response(serializer.data)

    def post(self, request):

        serializer = DocumentSerializer(data=request.data)

        if serializer.is_valid():

            document = serializer.save(user=request.user)

            extracted_text = ""

            file_path = document.uploaded_file.path

            if document.file_type == "pdf":
                extracted_text = extract_text_from_pdf(file_path)

            elif document.file_type == "docx":
                extracted_text = extract_text_from_docx(file_path)

            elif document.file_type == "txt":
                extracted_text = extract_text_from_txt(file_path)

            document.extracted_text = extracted_text
            document.save()

            return Response(
                {
                    "message": "File uploaded successfully",
                    "document_id": document.id,
                    "title": document.title,
                },
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )