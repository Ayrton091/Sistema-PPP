function generarPDF() {
    // Obtener la instancia de jsPDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Código de estudiante (hardcodeado para pruebas)
    const codigo = "0020190512";

    // Función para obtener datos del formulario
    function obtenerDatosFormulario() {
        // Array de IDs de campos del formulario
        const camposFormulario = [
            'titulo', 'area_academica', 'descripcion', 'razon_social', 'ruc', 
            'titular', 'sector', 'sitio_web', 'departamento', 'provincia', 
            'distrito', 'direccion', 'area_practicante', 'modalidad', 
            'responsable', 'cargo', 'celular', 'email', 'funciones', 
            'fecha_inicio', 'fecha_fin'
        ];

        // Mapear los campos a sus etiquetas descriptivas
        const etiquetas = {
            'titulo': 'Título',
            'area_academica': 'Área Académica',
            'descripcion': 'Alcance y Descripción',
            'razon_social': 'Razón Social',
            'ruc': 'RUC',
            'titular': 'Titular',
            'sector': 'Sector',
            'sitio_web': 'Sitio Web',
            'departamento': 'Departamento',
            'provincia': 'Provincia',
            'distrito': 'Distrito',
            'direccion': 'Dirección',
            'area_practicante': 'Área Asignada al Practicante',
            'modalidad': 'Modalidad',
            'responsable': 'Responsable del Área',
            'cargo': 'Cargo',
            'celular': 'Celular del Responsable',
            'email': 'Email del Responsable',
            'funciones': 'Funciones propuestas',
            'fecha_inicio': 'Fecha de Inicio',
            'fecha_fin': 'Fecha de Fin'
        };

        // Generar datos del formulario
        return camposFormulario.map(campo => [
            etiquetas[campo],
            document.getElementById(campo).value || 'No especificado'
        ]);
    }

    // Función asíncrona principal para generar PDF
    async function crearPDF() {
        try {
            // Obtener datos del estudiante
            const response = await fetch(`http://localhost:4000/api/estudiante/${codigo}`, {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Error al obtener datos: ${response.status}`);
            }

            const estudiante = await response.json();

            // Preparar datos del estudiante
            const datosEstudiante = [
                ["Nombre", estudiante.nombre],
                ["DNI", estudiante.dni],
                ["Correo", estudiante.correo],
                ["Celular", estudiante.celular],
                ["Código", estudiante.codigo],
                ["Créditos Aprobados", estudiante.creditosAprobados],
                ["Matriculado", estudiante.matriculado ? "Sí" : "No"],
                ["Cursos Matriculados", estudiante.cursosMatriculados],
                ["Créditos Matriculados", estudiante.creditosMatriculados],
                ["Horas Matriculadas", estudiante.horasMatriculados]
            ];

            // Obtener datos del formulario
            const datosFormulario = obtenerDatosFormulario();

            // Configurar PDF
            doc.setFontSize(16);
            doc.text("Formulario de Prácticas Pre-Profesionales", 50, 20);

            // Tabla de datos del estudiante
            doc.autoTable({
                startY: 30,
                head: [['Campo', 'Valor']],
                body: datosEstudiante,
                theme: 'grid',
                headStyles: { fillColor: [0, 0, 128], textColor: [255, 255, 255] }
            });

            // Tabla de datos del formulario
            doc.autoTable({
                startY: doc.autoTable.previous.finalY + 10,
                head: [['Campo', 'Valor']],
                body: datosFormulario,
                theme: 'grid',
                headStyles: { fillColor: [128, 0, 0], textColor: [255, 255, 255] }
            });

            // Guardar PDF
            doc.save(`Formulario_PPP_${codigo}.pdf`);

        } catch (error) {
            console.error("Error al generar el PDF:", error);
            alert(`No se pudo generar el PDF: ${error.message}`);
        }
    }

    // Ejecutar la generación de PDF
    crearPDF();
}

// Añadir event listener al botón de generar PDF
document.getElementById("generatePDF").addEventListener("click", generarPDF);