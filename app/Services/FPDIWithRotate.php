<?php

namespace App\Services;

use setasign\Fpdi\Fpdi;

class FPDIWithRotate extends Fpdi
{
    // Propiedad para almacenar el ángulo de rotación
    var $angle = 0;

    // Propiedad para almacenar los estados extendidos (alpha y blend mode)
    protected $extgstates = array();

    /**
     * Método para rotar el contenido del PDF
     *
     * Aplica una rotación en el ángulo especificado. La rotación se realiza alrededor del punto (x, y),
     * si no se especifican las coordenadas, se usa la posición actual del cursor en el PDF.
     *
     * @param float $angle Ángulo en grados para rotar el contenido
     * @param float $x Coordenada X para el punto de rotación. Si no se proporciona, se usa la posición actual
     * @param float $y Coordenada Y para el punto de rotación. Si no se proporciona, se usa la posición actual
     */
    public function Rotate($angle, $x = -1, $y = -1)
    {
        if ($x == -1)
            $x = $this->x;
        if ($y == -1)
            $y = $this->y;
        if ($this->angle != 0)
            $this->_out('Q');
        $this->angle = $angle;
        if ($angle != 0) {
            $angle *= M_PI / 180;
            $c = cos($angle);
            $s = sin($angle);
            $cx = $x * $this->k;
            $cy = ($this->h - $y) * $this->k;
            $this->_out(sprintf('q %.5F %.5F %.5F %.5F %.2F %.2F cm 1 0 0 1 %.2F %.2F cm', $c, $s, -$s, $c, $cx, $cy, -$cx, -$cy));
        }
    }

    /**
     * Método para finalizar la página y restablecer la rotación
     *
     * Este método se llama al final de una página del PDF. Si hubo rotación aplicada,
     * restablece la rotación a su valor original (0 grados).
     */
    public function _endpage()
    {
        if ($this->angle != 0) {
            $this->angle = 0;
            $this->_out('Q');
        }
        parent::_endpage();
    }

    /**
     * Método para aplicar transparencia y modos de mezcla al contenido
     *
     * Este método establece un valor de transparencia (alpha) y un modo de mezcla
     * opcional para el contenido del PDF.
     *
     * @param float $alpha Valor de transparencia (de 0 a 1). 0 es completamente transparente y 1 es completamente opaco.
     * @param string $bm Modo de mezcla. Ejemplo: 'Normal', 'Multiply', 'Screen', etc.
     */
    function SetAlpha($alpha, $bm = 'Normal')
    {
        // Establece los parámetros de transparencia y modo de mezcla
        $gs = $this->AddExtGState(array('ca' => $alpha, 'CA' => $alpha, 'BM' => '/' . $bm));
        $this->SetExtGState($gs);
    }

    /**
     * Método para agregar un nuevo estado extendido (ExtGState)
     *
     * Este método agrega un estado extendido al documento, que incluye
     * parámetros como transparencia (alpha) y modo de mezcla.
     *
     * @param array $parms Parámetros del estado extendido. Ejemplo:
     *                      array('ca' => 0.5, 'CA' => 0.5, 'BM' => '/Normal')
     *
     * @return int El índice del estado extendido agregado
     */
    function AddExtGState($parms)
    {
        $n = count($this->extgstates) + 1;
        $this->extgstates[$n]['parms'] = $parms;
        return $n;
    }

    /**
     * Método para establecer el estado extendido actual
     *
     * Este método aplica un estado extendido específico usando el índice del mismo.
     *
     * @param int $gs Índice del estado extendido a aplicar
     */
    function SetExtGState($gs)
    {
        $this->_out(sprintf('/GS%d gs', $gs));
    }

    /**
     * Método para finalizar el documento PDF
     *
     * Este método se llama al finalizar la creación del documento PDF. Si hay estados extendidos
     * que se deben incluir, asegura que el documento se genere con la versión correcta.
     */
    function _enddoc()
    {
        if (!empty($this->extgstates) && $this->PDFVersion < '1.4')
            $this->PDFVersion = '1.4';
        parent::_enddoc();
    }

    /**
     * Método para agregar los estados extendidos al PDF
     *
     * Este método genera los objetos necesarios para cada estado extendido y los agrega al documento PDF.
     */
    function _putextgstates()
    {
        for ($i = 1; $i <= count($this->extgstates); $i++) {
            $this->_newobj();
            $this->extgstates[$i]['n'] = $this->n;
            $this->_put('<</Type /ExtGState');
            $parms = $this->extgstates[$i]['parms'];
            $this->_put(sprintf('/ca %.3F', $parms['ca']));
            $this->_put(sprintf('/CA %.3F', $parms['CA']));
            $this->_put('/BM ' . $parms['BM']);
            $this->_put('>>');
            $this->_put('endobj');
        }
    }

    /**
     * Método para agregar el diccionario de recursos al documento PDF
     *
     * Este método agrega todos los recursos necesarios para el documento, incluidos los estados extendidos.
     */
    function _putresourcedict()
    {
        parent::_putresourcedict();
        $this->_put('/ExtGState <<');
        foreach ($this->extgstates as $k => $extgstate)
            $this->_put('/GS' . $k . ' ' . $extgstate['n'] . ' 0 R');
        $this->_put('>>');
    }

    /**
     * Método para agregar todos los recursos al documento PDF
     *
     * Este método asegura que todos los recursos necesarios, incluidos los estados extendidos,
     * se agreguen al PDF.
     */
    function _putresources()
    {
        $this->_putextgstates();
        parent::_putresources();
    }
}

?>
