<?php

declare(strict_types=1);

namespace Diviky\Bright\Helpers\Iterator;

use Closure;
use Illuminate\Database\Query\Builder;
use InvalidArgumentException;
use Iterator;

/**
 * @author Sankar <sankar.suda@gmail.com>
 */
class SelectIterator implements Iterator
{
    /**
     * @var int
     */
    protected $position = 0;

    /**
     * @var int
     */
    protected $totalPosition = 0;

    /**
     * @var bool
     */
    protected $next;

    /**
     * @var array
     */
    protected $results;

    /**
     * @var Builder
     */
    protected $builder;

    /**
     * @var int
     */
    protected $page = 1;

    /**
     * @var null|Closure
     */
    protected $callback;

    /** @var int Size of each chunk */
    protected $chunkSize;

    /** @var array Current chunk */
    protected $chunk;

    /**
     * @param Builder $builder
     * @param int     $chunkSize
     * @param Closure $callback
     *
     * @throws InvalidArgumentException
     */
    public function __construct($builder, $chunkSize, Closure $callback = null)
    {
        if ($chunkSize < 0) {
            throw new InvalidArgumentException("The chunk size must be equal or greater than zero; {$chunkSize} given");
        }

        $this->chunkSize = $chunkSize;
        $this->builder   = $builder;
        $this->callback  = $callback;
    }

    /**
     * {@inheritDoc}
     */
    public function rewind(): void
    {
        $this->reset();
        $this->query();
    }

    /**
     * {@inheritDoc}
     */
    public function current()
    {
        return $this->results[$this->position];
    }

    public function key()
    {
        return $this->totalPosition;
    }

    /**
     * {@inheritDoc}
     */
    public function next(): void
    {
        ++$this->position;
        ++$this->totalPosition;

        if (!isset($this->results[$this->position]) && $this->next) {
            $this->query();
        }
    }

    /**
     * {@inheritDoc}
     */
    public function valid()
    {
        return isset($this->results[$this->position]) && $this->next;
    }

    /**
     * {@inheritDoc}
     */
    protected function reset(): void
    {
        $this->position      = 0;
        $this->totalPosition = 0;
        $this->next          = false;
        $this->page          = 1;
        $this->results       = [];
    }

    protected function query(): void
    {
        $rows = $this->builder
            ->forPage($this->page, $this->chunkSize)
            ->get();

        if ($rows->count() > 0) {
            $this->next = true;
            if ($this->callback) {
                $rows->transform($this->callback);
            }

            ++$this->page;
            $this->position = 0;
            $this->results  = $rows->toArray();
        } else {
            $this->reset();
        }

        unset($rows);
    }
}
