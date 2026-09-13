<?php

namespace Kanboard\Plugin\ThemeRevision\Helper;
use Kanboard\Plugin\ThemeRevision\Helper\BaseHelper;

class ModeSwitchHelper extends BaseHelper
{
    private $prdCSSFile = '/Asset/main.min.css';

    public function productionMode(){
        // Assets are produced by `npm run build`, never by the PHP web process.
        $this->getPlugin()->hook->on('template:layout:css', array('template' => 'plugins/ThemeRevision'.$this->prdCSSFile));
    }

    public function developmentMode(){
        // `npm run dev` watches the same stable output paths with source maps.
        $this->productionMode();
    }
}
