<?php

namespace App\Utils;

class Verify
{
    public static function isPositiveNumber($value)
    {
        if (!isset($value))
            return false;

        if (!is_numeric($value))
            return false;

        if (is_nan($value))
            return false;

        if ($value < 0)
            return false;

        return true;
    }
}
